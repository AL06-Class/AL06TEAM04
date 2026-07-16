export const weekdayOptions = ["월", "화", "수", "목", "금"] as const;

export const directInputOption = "직접입력";

export const industryJobRoleOptions = {
  "IT/소프트웨어": [
    "프론트엔드 개발자",
    "백엔드 개발자",
    "풀스택 개발자",
    "모바일 앱 개발자",
    "AI 엔지니어",
    "DevOps 엔지니어",
    "QA 엔지니어",
    "AI 서비스 기획자"
  ],
  "콘텐츠/미디어": ["콘텐츠 디자이너", "콘텐츠 기획자", "영상 편집자", "브랜드 디자이너", "SNS 운영 매니저"],
  "이커머스/유통": ["MD", "서비스 운영 매니저", "CRM 마케터", "퍼포먼스 마케터", "데이터 분석가"],
  "교육": ["교육 콘텐츠 기획자", "서비스 운영 매니저", "UI/UX 디자이너", "교육 운영 매니저", "L&D 담당자"],
  "금융/핀테크": ["데이터 분석가", "데이터 엔지니어", "백엔드 개발자", "정보보안 담당자", "AML 담당자", "서비스 기획자"],
  "헬스케어": ["UI/UX 디자이너", "의료 콘텐츠 기획자", "의료 데이터 분석가", "의료기기 PM", "서비스 운영 매니저"],
  "제조": ["생산관리", "품질관리(QA/QC)", "구매관리", "SCM 담당자", "데이터 분석가"],
  "마케팅/광고": ["퍼포먼스 마케터", "CRM 마케터", "브랜드 마케터", "콘텐츠 기획자", "데이터 분석가"],
  "고객서비스": ["고객 상담 매니저", "CX 매니저", "VOC 분석가", "QA 담당자", "서비스 운영 매니저"],
  "인사/채용": ["채용 담당자", "HRBP", "조직문화 담당자", "교육(L&D) 담당자", "채용 마케터"]
} as const;

export const industryOptions = Object.keys(industryJobRoleOptions);

export const jobRoleOptions = Array.from(new Set(Object.values(industryJobRoleOptions).flat())).sort((a, b) =>
  a.localeCompare(b, "ko")
);

export function getJobRolesByIndustry(industry: string) {
  return industry in industryJobRoleOptions
    ? [...industryJobRoleOptions[industry as keyof typeof industryJobRoleOptions]]
    : [];
}

export const flexibleWorkTypeOptions = [
  "100% 원격근무",
  "부분 원격근무",
  "단축 근무(일 7시간 이하)",
  "유연 출퇴근(일 8시간)"
] as const;

export type FlexibleWorkType = (typeof flexibleWorkTypeOptions)[number];

export function normalizeFlexibleWorkType(value = "", flexibleWorkTypes: string[] = [], workTimeText = ""): FlexibleWorkType {
  const source = [value, ...flexibleWorkTypes, workTimeText].join(" ");
  const hourMatch = source.match(/(\d{1,2}):\d{2}\s*-\s*(\d{1,2}):\d{2}/);

  if (source.includes("100%") || source.includes("완전 원격")) return "100% 원격근무";
  if (source.includes("재택") || source.includes("원격") || source.includes("하이브리드")) return "부분 원격근무";

  if (hourMatch) {
    const startHour = Number(hourMatch[1]);
    const endHour = Number(hourMatch[2]);
    if (endHour - startHour <= 7) return "단축 근무(일 7시간 이하)";
  }

  if (source.includes("단축") || source.includes("일 4시간") || source.includes("일 5시간") || source.includes("일 6시간") || source.includes("일 7시간")) {
    return "단축 근무(일 7시간 이하)";
  }

  return "유연 출퇴근(일 8시간)";
}
