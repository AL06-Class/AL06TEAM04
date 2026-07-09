export type FlexibleJobCompany = {
  id: string;
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
};

export const flexibleJobCompanies: FlexibleJobCompany[] = [
  {
    id: "flex-company-001",
    rank: 1,
    companyName: "원더독스",
    logoType: "wonderdogs",
    badge: "완전 매칭",
    badgeTone: "success",
    title: "UI/UX 디자이너 · 경력 3년 이상",
    distance: "강남역 도보 7분",
    workDays: "주 3일 협의가능",
    workHours: "4시간 10~15시 사이",
    workStyle: "하이브리드",
    assignment: "실무 과제 있음",
    estimatedTime: "예상 10분"
  },
  {
    id: "flex-company-002",
    rank: 2,
    companyName: "넥스트러너스",
    logoType: "next-runners",
    badge: "부분 매칭",
    badgeTone: "warning",
    title: "웹 디자이너 · 경력 5년 이상",
    distance: "신사역 도보 5분",
    workDays: "요일 협의 가능",
    workHours: "13:00 ~ 18:00 사이 일 3시간",
    workStyle: "부분 재택",
    assignment: "실무 과제 있음",
    estimatedTime: "예상 19분"
  },
  {
    id: "flex-company-003",
    rank: 3,
    companyName: "브라이트픽셀",
    logoText: "BP",
    logoType: "text",
    badge: "요일 우선",
    badgeTone: "info",
    title: "브랜드 디자이너 · 경력 4년 이상",
    distance: "논현역 도보 6분",
    workDays: "주 1~2회",
    workHours: "3시간 14~18시 사이",
    workStyle: "부분 재택",
    assignment: "과제 없음",
    estimatedTime: "예상 13분"
  },
  {
    id: "flex-company-004",
    rank: 4,
    companyName: "모션허브",
    logoText: "MH",
    logoType: "text",
    badge: "부분 매칭",
    badgeTone: "warning",
    title: "콘텐츠 디자이너 · 경력 3년 이상",
    distance: "학동역 도보 4분",
    workDays: "월~금",
    workHours: "4시간 9~13시 사이",
    workStyle: "출근 근무",
    assignment: "실무 과제 있음",
    estimatedTime: "예상 16분"
  }
];
