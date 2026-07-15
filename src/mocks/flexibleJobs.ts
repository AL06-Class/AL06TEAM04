import { jobPostingsMock } from "./jobPostings";

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
  workHours: string;
  workStyle: string;
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
  { top: "25%", left: "54%" }
];

function buildLogoText(companyName: string) {
  const korean = companyName.replace(/\([^)]*\)/g, "").trim();
  return korean.slice(0, 2).toUpperCase();
}

export const flexibleJobCompanies: FlexibleJobCompany[] = jobPostingsMock.map((jobPosting, index) => {
  const rank = index + 1;
  const badge = badgeByRank[index] ?? badgeByRank[badgeByRank.length - 1];

  return {
    id: jobPosting.companyId,
    jobPostingId: jobPosting.jobPostingId,
    rank,
    companyName: jobPosting.companyName ?? jobPosting.companyId,
    logoText: buildLogoText(jobPosting.companyName ?? jobPosting.companyId),
    logoType: rank === 2 ? "next-runners" : "text",
    badge: badge.badge,
    badgeTone: badge.badgeTone,
    title: `${jobPosting.title} · ${jobPosting.experienceLevel}`,
    distance: `${jobPosting.primaryStationName} 도보 ${jobPosting.stationWalkMinutes ?? 7}분`,
    workDays: `${jobPosting.flexibleWorkTypes[0]} · ${jobPosting.workDays.join(", ")}`,
    workHours: jobPosting.workTimeText ?? "시간 협의 가능",
    workStyle: jobPosting.workType,
    assignment: jobPosting.hasAssignment ? "과제 있음" : "과제 없음",
    estimatedTime: `예상 ${10 + rank * 2}분`,
    mapPosition: mapPositions[index] ?? { top: "40%", left: "60%" }
  };
});
