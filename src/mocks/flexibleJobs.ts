import type { JobPosting } from "../types/jobPosting";
import { normalizeFlexibleWorkType } from "../constants/jobOptions";
import { getPublicJobPostings } from "./jobPostings";

export type FlexibleJobCompany = {
  id: string;
  jobPostingId: string;
  rank: number;
  companyName: string;
  logoText?: string;
  logoType?: "text" | "wonderdogs" | "next-runners";
  badge: string;
  badgeTone: "success" | "warning" | "info";
  title: string;
  distance: string;
  workDays: string;
  workDayValues: string[];
  workHours: string;
  timeSlot: "오전" | "오후" | "저녁";
  flexibleWorkType: string;
  jobCategory: string;
  assignment: string;
  estimatedTime: string;
  mapPosition: {
    top: string;
    left: string;
  };
};

const badgeByRank: Array<Pick<FlexibleJobCompany, "badge" | "badgeTone">> = [
  { badge: "완전 매칭", badgeTone: "success" },
  { badge: "완전 매칭", badgeTone: "success" },
  { badge: "완전 매칭", badgeTone: "success" },
  { badge: "부분 매칭", badgeTone: "warning" },
  { badge: "부분 매칭", badgeTone: "warning" },
  { badge: "부분 매칭", badgeTone: "warning" },
  { badge: "요일 우선", badgeTone: "info" },
  { badge: "요일 우선", badgeTone: "info" },
  { badge: "시간 우선", badgeTone: "info" },
  { badge: "시간 우선", badgeTone: "info" }
];

const mapPositions = [
  { top: "34%", left: "56%" },
  { top: "28%", left: "62%" },
  { top: "42%", left: "50%" },
  { top: "38%", left: "69%" },
  { top: "47%", left: "58%" },
  { top: "31%", left: "48%" },
  { top: "22%", left: "72%" },
  { top: "53%", left: "66%" },
  { top: "44%", left: "74%" },
  { top: "25%", left: "54%" },
  { top: "58%", left: "49%" },
  { top: "36%", left: "76%" },
  { top: "20%", left: "58%" },
  { top: "50%", left: "72%" },
  { top: "29%", left: "42%" },
  { top: "61%", left: "63%" },
  { top: "46%", left: "45%" },
  { top: "18%", left: "68%" }
];

function buildLogoText(companyName: string) {
  const korean = companyName.replace(/\([^)]*\)/g, "").trim();
  return korean.slice(0, 2).toUpperCase();
}

function getTimeSlot(workTimeText = ""): FlexibleJobCompany["timeSlot"] {
  const match = workTimeText.match(/(\d{1,2}):\d{2}/);
  const startHour = match ? Number(match[1]) : 10;
  if (startHour < 12) return "오전";
  if (startHour < 18) return "오후";
  return "저녁";
}

function getDistance(jobPosting: JobPosting) {
  if (jobPosting.locationType === "remote") return "원격 근무";
  return `${jobPosting.primaryStationName || "삼성역"} 도보 ${jobPosting.stationWalkMinutes ?? 7}분`;
}

export function buildFlexibleJobCompanies(jobPostings: JobPosting[] = getPublicJobPostings()): FlexibleJobCompany[] {
  return jobPostings.map((jobPosting, index) => {
    const rank = index + 1;
    const badge = badgeByRank[index] ?? badgeByRank[badgeByRank.length - 1];
    const companyName = jobPosting.companyName ?? jobPosting.companyId;

    return {
      id: `${jobPosting.companyId}-${jobPosting.jobPostingId}`,
      jobPostingId: jobPosting.jobPostingId,
      rank,
      companyName,
      logoText: buildLogoText(companyName),
      logoType: jobPosting.companyId === "company_wonderdogs" ? "wonderdogs" : rank === 2 ? "next-runners" : "text",
      badge: badge.badge,
      badgeTone: badge.badgeTone,
      title: `${jobPosting.title} · ${jobPosting.experienceLevel}`,
      distance: getDistance(jobPosting),
      workDays: jobPosting.workDays.join(", "),
      workDayValues: jobPosting.workDays,
      workHours: jobPosting.workTimeText ?? "시간 협의 가능",
      timeSlot: getTimeSlot(jobPosting.workTimeText),
      flexibleWorkType: normalizeFlexibleWorkType(jobPosting.workType, jobPosting.flexibleWorkTypes, jobPosting.workTimeText),
      jobCategory: jobPosting.jobCategory,
      assignment: jobPosting.hasAssignment ? "과제 있음" : "과제 없음",
      estimatedTime: `예상 ${10 + rank * 2}분`,
      mapPosition: mapPositions[index % mapPositions.length]
    };
  });
}

export const flexibleJobCompanies: FlexibleJobCompany[] = buildFlexibleJobCompanies();
