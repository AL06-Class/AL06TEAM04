import { getCompanyJobPostings, getPublicJobPostings } from "../mocks/jobPostings";
import type { JobPosting, JobPostingStatus } from "../types/jobPosting";
import { getFirestoreCollection } from "./firebaseRest";

function getStringField(data: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

function getNumberField(data: Record<string, unknown>, keys: string[], fallback: number | null = null) {
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

function getLocationField(data: Record<string, unknown>) {
  const value = data.location;
  if (
    value &&
    typeof value === "object" &&
    "lat" in value &&
    "lng" in value &&
    typeof value.lat === "number" &&
    typeof value.lng === "number"
  ) {
    return { lat: value.lat, lng: value.lng };
  }
  return null;
}

function getStatusField(data: Record<string, unknown>): JobPostingStatus {
  const status = getStringField(data, ["status"], "posted");
  return status === "posted" || status === "draft" || status === "closed" ? status : "posted";
}

export function mapFirestoreJobPosting(data: Record<string, unknown>, id: string): JobPosting {
  const jobTitle = getStringField(data, ["jobTitle", "jobCategory", "occupation"], "직무 미정");
  const workType = getStringField(data, ["workType"], "유연 출퇴근(일 8시간)");
  const flexibleWorkTypes = getStringArrayField(data, ["flexibleWorkTypes"], workType ? [workType] : []);

  return {
    jobPostingId: getStringField(data, ["jobPostingId", "id"], id),
    wantedJobId: getNumberField(data, ["wantedJobId"], null) ?? undefined,
    wantedSourceUrl: getStringField(data, ["wantedSourceUrl"]),
    companyId: getStringField(data, ["companyId"], "company_wonderdogs"),
    companyName: getStringField(data, ["companyName"], "원더독스"),
    recruiterId: getStringField(data, ["recruiterId"], "recruiter_wonderdogs"),
    title: getStringField(data, ["title"], jobTitle),
    industry: getStringField(data, ["industry", "businessField"], ""),
    jobCategory: getStringField(data, ["jobCategory"], jobTitle),
    jobTitle,
    employmentType: getStringField(data, ["employmentType"], "정규직"),
    experienceLevel: getStringField(data, ["experienceLevel"], "경력 무관"),
    experienceMin: getNumberField(data, ["experienceMin"], null),
    experienceMax: getNumberField(data, ["experienceMax"], null),
    requiredSkills: getStringArrayField(data, ["requiredSkills"]),
    workType,
    flexibleWorkTypes,
    workDays: getStringArrayField(data, ["workDays"]),
    salaryType: getStringField(data, ["salaryType"], "text"),
    salaryText: getStringField(data, ["salaryText"], "회사 내규에 따름"),
    locationType: getStringField(data, ["locationType"], "office"),
    address: getStringField(data, ["address"]),
    roadAddress: getStringField(data, ["roadAddress"]),
    jibunAddress: getStringField(data, ["jibunAddress"]),
    sourceWantedAddress: getStringField(data, ["sourceWantedAddress"]),
    location: getLocationField(data),
    primaryStationName: getStringField(data, ["primaryStationName"]),
    stationWalkMinutes: getNumberField(data, ["stationWalkMinutes"], null) ?? undefined,
    workTimeText: getStringField(data, ["workTimeText"]),
    applicationPeriod: getStringField(data, ["applicationPeriod"]),
    mainResponsibilities: getStringField(data, ["mainResponsibilities"]),
    requirements: getStringArrayField(data, ["requirements"]),
    preferences: getStringArrayField(data, ["preferences"]),
    hiringProcess: getStringArrayField(data, ["hiringProcess"]),
    assignmentTitle: getStringField(data, ["assignmentTitle"]),
    assignmentSummary: getStringField(data, ["assignmentSummary"]),
    assignmentIds: getStringArrayField(data, ["assignmentIds"]),
    hasAssignment: Boolean(data.hasAssignment),
    status: getStatusField(data),
    createdAt: getStringField(data, ["createdAt"]),
    updatedAt: getStringField(data, ["updatedAt"]),
    postedAt: getStringField(data, ["postedAt"]) || null,
    closedAt: getStringField(data, ["closedAt"]) || null,
    isRecommended: Boolean(data.isRecommended),
    applicantCount: getNumberField(data, ["applicantCount"], 0) ?? 0
  };
}

async function fetchAllJobPostings() {
  try {
    const jobPostings = await getFirestoreCollection("jobPostings", mapFirestoreJobPosting);
    return jobPostings.length > 0 ? jobPostings : null;
  } catch {
    return null;
  }
}

export async function fetchPublicJobPostings() {
  const firebaseJobPostings = await fetchAllJobPostings();
  return firebaseJobPostings
    ? firebaseJobPostings.filter((jobPosting) => jobPosting.status === "posted")
    : getPublicJobPostings();
}

export async function fetchCompanyJobPostings() {
  const firebaseJobPostings = await fetchAllJobPostings();
  return firebaseJobPostings
    ? firebaseJobPostings.filter((jobPosting) => jobPosting.companyId === "company_wonderdogs")
    : getCompanyJobPostings();
}
