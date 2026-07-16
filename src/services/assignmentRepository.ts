import { assignmentDbMock, type AssignmentDbItem } from "../mocks/assignmentDb";
import { getFirestoreCollection } from "./firebaseRest";

function getStringField(data: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

function getNumberField(data: Record<string, unknown>, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) return Number(value);
  }
  return fallback;
}

function getStringArrayField(data: Record<string, unknown>, keys: string[], fallback: string[] = []) {
  for (const key of keys) {
    const value = data[key];
    if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean);
    if (typeof value === "string" && value.trim()) return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return fallback;
}

export function mapFirestoreAssignmentDbItem(data: Record<string, unknown>, id: string): AssignmentDbItem {
  const title = getStringField(data, ["title", "assignmentTitle", "과제명"], "제목 없는 과제");
  const evaluationCriteria = getStringField(data, ["evaluationCriteria", "evaluation", "평가 기준"]);

  return {
    assignmentId: getStringField(data, ["assignmentId", "id", "과제 ID"], id),
    owner: getStringField(data, ["owner"], "public") === "mine" ? "mine" : "public",
    companyName: getStringField(data, ["companyName", "company", "source"], "과제 DB"),
    status: (["available", "linked", "draft"].includes(getStringField(data, ["status"]))
      ? getStringField(data, ["status"])
      : "available") as AssignmentDbItem["status"],
    occupation: getStringField(data, ["occupation", "jobTitle", "채용직무"]),
    businessField: getStringField(data, ["businessField", "industry", "업종"]),
    seniority: getStringField(data, ["seniority", "difficulty", "난이도"], "중"),
    title,
    adoptionCount: getNumberField(data, ["adoptionCount", "난이도별 순번"], 0),
    estimatedHours: getStringField(data, ["estimatedHours"], "3~4시간"),
    summary: getStringField(data, ["summary", "goal", "assignmentGoal", "과제 목표"], title),
    evaluationItems: getStringArrayField(data, ["evaluationItems"], evaluationCriteria ? evaluationCriteria.split(",") : []),
    requiredSkills: getStringField(data, ["requiredSkills", "필수 업무 스킬"]),
    mainProducts: getStringField(data, ["mainProducts", "주력 상품 및 서비스"]),
    mainTasks: getStringField(data, ["mainTasks", "입사 후 주요 업무"]),
    submitCondition: getStringField(data, ["submitCondition", "제출 조건"]),
    evaluationCriteria
  };
}

export async function fetchAssignments() {
  try {
    const assignments = await getFirestoreCollection("assignments", mapFirestoreAssignmentDbItem);
    return assignments.length > 0 ? assignments : assignmentDbMock;
  } catch {
    return assignmentDbMock;
  }
}
