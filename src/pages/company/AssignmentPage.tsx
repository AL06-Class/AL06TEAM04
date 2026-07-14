import { useEffect, useMemo, useState } from "react";
import { PageContainer } from "../../components/common/PageContainer";
import { CompanyHeaderNav } from "../../components/company/CompanyHeaderNav";

type Page = "main" | "assignments";
type AssignmentTab = "ai" | "manage";
type Difficulty = "상" | "중" | "하";
type AssignmentStatus = "available" | "linked" | "draft";
type GeneratedStatus = "generated" | "draft" | "registered";
type AssignmentSort = "latest" | "oldest" | "jobTitle" | "difficultyHigh" | "difficultyLow";

type LinkedAssignment = {
  title: string;
  difficulty: Difficulty;
};

type Assignment = {
  id: string;
  status: AssignmentStatus;
  createdAt: string;
  savedAt?: string;
  title: string;
  jobTitle: string;
  experienceLevel: string;
  linkedJobTitle?: string;
  postingPeriod?: string;
  linkedAssignments: LinkedAssignment[];
  applicantsPending: number;
};

type CustomQuestion = {
  industry: string;
  jobRole: string[];
  isIndustryCustom: boolean;
  isJobRoleCustom: boolean;
  isRequiredSkillsCustom: boolean;
  isProductServiceCustom: boolean;
  isMainWorkCustom: boolean;
  requiredSkills: string[];
  productService: string[];
  mainWork: string[];
  additionalRequest: string;
};

type GeneratedAssignment = {
  id: string;
  title: string;
  difficulty: Difficulty;
  goal: string;
  requirements: string;
  evaluation: string;
  status: GeneratedStatus;
  selected: boolean;
  isAdditional?: boolean;
};

const directInputOption = "직접입력";

const assignments: Assignment[] = [
  {
    id: "assignment-ai",
    status: "available",
    createdAt: "2024.05.20",
    title: "AI 엔지니어 채용 공고",
    jobTitle: "AI 엔지니어",
    experienceLevel: "경력 3~5년",
    linkedAssignments: [
      { title: "AI 솔루션 API 연동 과제", difficulty: "상" },
      { title: "모델 응답 품질 개선안 작성 과제", difficulty: "중" }
    ],
    applicantsPending: 4
  },
  {
    id: "assignment-data",
    status: "linked",
    createdAt: "2024.05.18",
    title: "데이터 분석가 채용 공고",
    jobTitle: "데이터 분석가",
    experienceLevel: "경력 3~5년",
    linkedJobTitle: "데이터 분석가 채용",
    postingPeriod: "2024.05.18 ~ 2024.06.17",
    linkedAssignments: [
      { title: "BI 대시보드 지표 분석 과제", difficulty: "상" },
      { title: "이상 거래 모니터링 리포트 작성 과제", difficulty: "상" }
    ],
    applicantsPending: 7
  },
  {
    id: "assignment-crm",
    status: "draft",
    createdAt: "2024.05.17",
    savedAt: "2024.05.17",
    title: "CRM 마케터 채용 공고",
    jobTitle: "CRM 마케터",
    experienceLevel: "경력 1~3년",
    linkedAssignments: [{ title: "고객 세그먼트별 CRM 캠페인 기획 과제", difficulty: "하" }],
    applicantsPending: 0
  },
  {
    id: "assignment-cx",
    status: "available",
    createdAt: "2024.05.15",
    title: "CX 매니저 채용 공고",
    jobTitle: "CX 매니저",
    experienceLevel: "경력 3~5년",
    linkedAssignments: [
      { title: "VOC 기반 개선안 도출 과제", difficulty: "중" },
      { title: "상담 품질 관리 체크리스트 작성 과제", difficulty: "중" }
    ],
    applicantsPending: 3
  },
  {
    id: "assignment-frontend",
    status: "linked",
    createdAt: "2024.05.12",
    title: "프론트엔드 개발자 채용 공고",
    jobTitle: "프론트엔드 개발자",
    experienceLevel: "경력 5년 이상",
    linkedJobTitle: "프론트엔드 개발자 채용",
    postingPeriod: "2024.05.12 ~ 2024.06.11",
    linkedAssignments: [
      { title: "웹 서비스 신규 기능 화면 구현 과제", difficulty: "상" },
      { title: "관리자 페이지 컴포넌트 개선 과제", difficulty: "중" }
    ],
    applicantsPending: 5
  },
  {
    id: "assignment-hrbp",
    status: "draft",
    createdAt: "2024.05.10",
    savedAt: "2024.05.10",
    title: "HRBP 채용 공고",
    jobTitle: "HRBP",
    experienceLevel: "신입~3년",
    linkedAssignments: [{ title: "조직 이슈 진단 및 HR 운영 개선 과제", difficulty: "하" }],
    applicantsPending: 0
  }
];

const statusLabels: Record<AssignmentStatus, string> = {
  available: "공고연결 대기",
  linked: "공고연결 완료",
  draft: "임시저장"
};

const difficultyScores: Record<Difficulty, number> = {
  상: 3,
  중: 2,
  하: 1
};

const getAssignmentDateValue = (assignment: Assignment) =>
  Number((assignment.status === "draft" ? assignment.savedAt : assignment.createdAt)?.replace(/\./g, "") ?? 0);

const getAssignmentDifficultyScore = (assignment: Assignment) =>
  assignment.linkedAssignments.reduce((score, item) => score + difficultyScores[item.difficulty], 0);

const initialQuestion: CustomQuestion = {
  industry: "콘텐츠/미디어",
  jobRole: ["콘텐츠 디자이너"],
  isIndustryCustom: false,
  isJobRoleCustom: false,
  isRequiredSkillsCustom: false,
  isProductServiceCustom: false,
  isMainWorkCustom: false,
  requiredSkills: ["콘텐츠 기획, Figma, Photoshop, Illustrator"],
  productService: ["SNS 콘텐츠"],
  mainWork: ["콘텐츠 기획 및 제작"],
  additionalRequest: "실제 업무 상황처럼 문제 정의와 개선안을 함께 볼 수 있게 구성"
};

const industryOptions = [
  "IT/소프트웨어",
  "콘텐츠/미디어",
  "이커머스/유통",
  "교육",
  "금융/핀테크",
  "헬스케어",
  "제조",
  "마케팅/광고",
  "고객서비스",
  "인사/채용",
  directInputOption
];

const jobRoleOptions = [
  "프론트엔드 개발자",
  "백엔드 개발자",
  "풀스택 개발자",
  "모바일 앱 개발자",
  "AI 엔지니어",
  "DevOps 엔지니어",
  "QA 엔지니어",
  "AI 서비스 기획자",
  "UI/UX 디자이너",
  "콘텐츠 디자이너",
  "콘텐츠 기획자",
  "영상 편집자",
  "브랜드 디자이너",
  "SNS 운영 매니저",
  "MD",
  "CRM 마케터",
  "퍼포먼스 마케터",
  "브랜드 마케터",
  "교육 콘텐츠 기획자",
  "교육 운영 매니저",
  "L&D 담당자",
  "데이터 엔지니어",
  "정보보안 담당자",
  "AML 담당자",
  "서비스 기획자",
  "의료 콘텐츠 기획자",
  "의료 데이터 분석가",
  "의료기기 PM",
  "생산관리",
  "품질관리(QA/QC)",
  "구매관리",
  "SCM 담당자",
  "서비스 운영 매니저",
  "데이터 분석가",
  "고객 상담 매니저",
  "CX 매니저",
  "VOC 분석가",
  "QA 담당자",
  "채용 담당자",
  "HRBP",
  "조직문화 담당자",
  "교육(L&D) 담당자",
  "채용 마케터",
  directInputOption
];

type IndustryPreset = {
  jobRoles: string[];
  requiredSkills: string[];
  productServices: string[];
  mainWorks: string[];
};

const industryPresets: Record<string, IndustryPreset> = {
  "IT/소프트웨어": {
    jobRoles: ["프론트엔드 개발자", "백엔드 개발자", "풀스택 개발자", "모바일 앱 개발자", "AI 엔지니어", "DevOps 엔지니어", "QA 엔지니어", "AI 서비스 기획자"],
    requiredSkills: ["React, TypeScript, Git, GitHub", "Node.js, SQL, NoSQL, REST API, GraphQL", "Python, AI 모델 이해, API 연동", "CI/CD, Docker, 클라우드 배포", "테스트 케이스 작성, QA"],
    productServices: ["웹 서비스", "SaaS 플랫폼", "관리자 시스템", "Open API", "AI 솔루션"],
    mainWorks: ["신규 기능 개발", "기존 기능 개선", "API 개발 및 연동", "배포 및 모니터링", "서비스 성능 개선"]
  },
  "콘텐츠/미디어": {
    jobRoles: ["콘텐츠 디자이너", "콘텐츠 기획자", "영상 편집자", "브랜드 디자이너", "SNS 운영 매니저"],
    requiredSkills: ["콘텐츠 기획, Figma, Photoshop, Illustrator", "영상 편집, 카피라이팅, 브랜드 이해", "채널 운영, Notion, Slack"],
    productServices: ["SNS 콘텐츠", "영상 콘텐츠", "브랜드 콘텐츠", "뉴스레터", "콘텐츠 플랫폼"],
    mainWorks: ["콘텐츠 기획 및 제작", "캠페인 소재 제작", "브랜드 디자인 시안 제작", "SNS 채널 운영", "업로드 일정 관리"]
  },
  "이커머스/유통": {
    jobRoles: ["MD", "서비스 운영 매니저", "CRM 마케터", "퍼포먼스 마케터", "데이터 분석가"],
    requiredSkills: ["상품 관리, Excel, 고객 응대", "GA4, Meta Ads, Google Ads", "CRM, Braze, Amplitude", "SQL, Looker Studio"],
    productServices: ["온라인 쇼핑몰", "커머스 플랫폼", "배송 서비스", "정산 시스템", "CRM 캠페인"],
    mainWorks: ["상품 등록 및 관리", "주문/배송 이슈 대응", "판매 데이터 분석", "프로모션 운영", "고객 세그먼트 관리"]
  },
  교육: {
    jobRoles: ["교육 콘텐츠 기획자", "서비스 운영 매니저", "UI/UX 디자이너", "교육 운영 매니저", "L&D 담당자"],
    requiredSkills: ["교육 기획, 문서 작성, 커뮤니케이션", "콘텐츠 제작, 학습자 분석", "Figma, UX 리서치, Notion"],
    productServices: ["온라인 강의", "학습 플랫폼", "교육 자료", "수강 관리 서비스"],
    mainWorks: ["커리큘럼 기획 및 제작", "강의 자료 제작", "수강생 문의 대응", "학습 콘텐츠 개선", "교육 운영 지표 분석"]
  },
  "금융/핀테크": {
    jobRoles: ["데이터 분석가", "데이터 엔지니어", "백엔드 개발자", "정보보안 담당자", "AML 담당자", "서비스 기획자"],
    requiredSkills: ["SQL, Python, 데이터 분석", "Tableau, Power BI, Looker Studio", "REST API, 보안 이해, DB 설계", "금융 정책 이해, 리스크 관리"],
    productServices: ["금융 앱", "결제 서비스", "송금 서비스", "BI 대시보드", "데이터 분석 플랫폼"],
    mainWorks: ["사용자 데이터 분석", "금융 서비스 정책 정리", "결제 API 개선", "리스크 이슈 대응", "이상 거래 모니터링"]
  },
  헬스케어: {
    jobRoles: ["UI/UX 디자이너", "의료 콘텐츠 기획자", "의료 데이터 분석가", "의료기기 PM", "서비스 운영 매니저"],
    requiredSkills: ["Figma, UI 설계, UX 리서치", "의료 콘텐츠 기획, 개인정보 이해", "SQL, Python, 리포트 작성", "규제 이해, 일정 관리"],
    productServices: ["헬스케어 앱", "비대면 상담 플랫폼", "예약 관리 시스템", "건강관리 서비스", "의료기기 서비스"],
    mainWorks: ["화면 설계 및 사용성 개선", "의료 콘텐츠 기획 및 제작", "예약 관리", "사용자 문의 대응", "운영 지표 분석"]
  },
  제조: {
    jobRoles: ["생산관리", "품질관리(QA/QC)", "구매관리", "SCM 담당자", "데이터 분석가"],
    requiredSkills: ["생산 일정 관리, Excel, 재고 관리", "품질 이슈 분석, 리포트 작성", "SCM, 구매 프로세스, 협력사 커뮤니케이션"],
    productServices: ["제조 제품", "생산 라인", "부품 관리", "품질 관리 시스템", "공급망 관리 시스템"],
    mainWorks: ["생산 일정 관리", "재고 현황 확인", "품질 이슈 대응", "구매 일정 조율", "운영 프로세스 개선"]
  },
  "마케팅/광고": {
    jobRoles: ["퍼포먼스 마케터", "CRM 마케터", "브랜드 마케터", "콘텐츠 기획자", "데이터 분석가"],
    requiredSkills: ["GA4, Meta Ads, Google Ads", "CRM, Braze, Amplitude", "콘텐츠 기획, 카피라이팅", "Looker Studio, 리포트 작성"],
    productServices: ["광고 캠페인", "랜딩페이지", "브랜드 캠페인", "SNS 콘텐츠", "CRM 캠페인"],
    mainWorks: ["광고 집행 및 성과 분석", "캠페인 기획 및 운영", "리포트 작성", "개선안 도출 및 적용", "고객 세그먼트 관리"]
  },
  고객서비스: {
    jobRoles: ["고객 상담 매니저", "CX 매니저", "VOC 분석가", "QA 담당자", "서비스 운영 매니저"],
    requiredSkills: ["고객 응대, 이슈 분류, 커뮤니케이션", "VOC 분석, Excel, 리포트 작성", "CS 품질 관리, QA 체크리스트"],
    productServices: ["고객지원 서비스", "상담 시스템", "FAQ/도움말", "운영 대시보드", "비대면 상담 플랫폼"],
    mainWorks: ["고객 문의 대응", "이슈 유형 분류", "FAQ 개선", "VOC 기반 개선안 도출", "상담 품질 관리"]
  },
  "인사/채용": {
    jobRoles: ["채용 담당자", "HRBP", "조직문화 담당자", "교육(L&D) 담당자", "채용 마케터"],
    requiredSkills: ["채용 운영, 커뮤니케이션, 문서 작성", "지원자 관리, 일정 조율, Excel", "채용 브랜딩, 콘텐츠 기획", "Notion, Slack, 면접 운영"],
    productServices: ["채용 플랫폼", "지원자 관리 서비스", "채용 공고", "면접 일정 관리", "채용 브랜딩 콘텐츠"],
    mainWorks: ["채용 공고 작성", "지원자 일정 조율", "지원자 문의 대응", "채용 운영 프로세스 개선", "조직문화 프로그램 운영"]
  }
};

const getPreset = (industry: string) => industryPresets[industry] ?? industryPresets["콘텐츠/미디어"];

const withDirectInput = (options: string[]) => [...options, directInputOption];

const formatQuestionList = (items: string[]) => items.filter(Boolean).join(", ");

const assignmentThemes = [
  "핵심 사용자 문제 정의",
  "서비스 화면 개선안 작성",
  "업무 프로세스 체크리스트 설계",
  "성과 리포트 구조 제안",
  "고객 피드백 분류 기준 정리",
  "신규 기능 운영 시나리오 작성",
  "상품 소개 문구 개선",
  "협업 요청서 작성",
  "리스크 대응안 정리",
  "우선순위 판단 기준 설계"
];

const difficultyPlan: Difficulty[] = ["상", "상", "상", "상", "중", "중", "중", "하", "하", "하"];
const additionalDifficultyPlan: Difficulty[] = ["상", "상", "중", "중", "하"];

function createGeneratedAssignment(
  index: number,
  seed: number,
  question: CustomQuestion,
  difficultyOverride?: Difficulty,
  isAdditional = false
): GeneratedAssignment {
  const difficulty = difficultyOverride ?? difficultyPlan[index % difficultyPlan.length];
  const theme = assignmentThemes[(index + seed) % assignmentThemes.length];
  const jobRoleText = formatQuestionList(question.jobRole);

  return {
    id: `generated-${seed}-${index}`,
    title: `${jobRoleText} ${theme}`,
    difficulty,
    goal: `${question.industry} 분야의 ${formatQuestionList(question.productService)} 업무 맥락에서 ${jobRoleText}의 실무 판단력을 확인합니다.`,
    requirements: `${formatQuestionList(question.mainWork)} 상황을 기준으로 문제 정의, 실행안, 필요한 ${formatQuestionList(question.requiredSkills)}, 예상 결과를 정리합니다. ${question.additionalRequest}`,
    evaluation:
      difficulty === "상"
        ? "전략적 사고 35%, 실행 구체성 30%, 협업 관점 20%, 완성도 15%"
        : difficulty === "중"
          ? "문제 이해도 30%, 실행 가능성 30%, 업무 스킬 활용 25%, 전달력 15%"
          : "기본 이해도 35%, 필수 항목 충족 30%, 명확성 20%, 성실도 15%",
    status: "generated",
    selected: false,
    isAdditional
  };
}

const initialAssignmentTabKey = "wd:assignment-initial-tab";
const assignmentTabHistoryKey = "wdAssignmentTab";

function createAssignmentTabHistoryState(tab: AssignmentTab) {
  const currentState = window.history.state;
  return {
    ...(typeof currentState === "object" && currentState !== null ? currentState : {}),
    [assignmentTabHistoryKey]: tab
  };
}

function getAssignmentTabFromLocation(): AssignmentTab {
  return new URLSearchParams(window.location.search).get("tab") === "ai" ? "ai" : "manage";
}

function getInitialAssignmentTab(): AssignmentTab {
  const storedTab = window.sessionStorage.getItem(initialAssignmentTabKey);

  return getAssignmentTabFromLocation() === "ai" || storedTab === "ai" ? "ai" : "manage";
}

export function AssignmentPage() {
  const [activeTab, setActiveTab] = useState<AssignmentTab>(getInitialAssignmentTab);

  useEffect(() => {
    const storedTab = window.sessionStorage.getItem(initialAssignmentTabKey);
    window.sessionStorage.removeItem(initialAssignmentTabKey);

    const startsOnAi = storedTab === "ai" || getAssignmentTabFromLocation() === "ai";
    if (startsOnAi && window.history.state?.[assignmentTabHistoryKey] !== "ai") {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("tab");
      window.history.replaceState(
        createAssignmentTabHistoryState("manage"),
        "",
        `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
      );
      currentUrl.searchParams.set("tab", "ai");
      window.history.pushState(
        createAssignmentTabHistoryState("ai"),
        "",
        `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
      );
    }

    const syncActiveTab = () => setActiveTab(getAssignmentTabFromLocation());
    window.addEventListener("popstate", syncActiveTab);

    return () => window.removeEventListener("popstate", syncActiveTab);
  }, []);

  const changeTab = (nextTab: AssignmentTab) => {
    if (nextTab !== activeTab) {
      const nextUrl = new URL(window.location.href);
      if (nextTab === "ai") {
        nextUrl.searchParams.set("tab", "ai");
      } else {
        nextUrl.searchParams.delete("tab");
      }
      window.history.pushState(
        createAssignmentTabHistoryState(nextTab),
        "",
        `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
      );
    }
    setActiveTab(nextTab);
  };

  return (
    <div className="wd-sai-company-page">
      <CompanyHeaderNav activePath="/company/assignments" />
      <PageContainer>
        <AssignmentWorkspacePage activeTab={activeTab} onChangeTab={changeTab} />
      </PageContainer>
    </div>
  );
}
function AssignmentWorkspacePage({
  activeTab,
  onChangeTab
}: {
  activeTab: AssignmentTab;
  onChangeTab: (tab: AssignmentTab) => void;
}) {
  const [focusedAssignment, setFocusedAssignment] = useState<Assignment | null>(null);

  const openLinkedAssignments = (assignment: Assignment) => {
    setFocusedAssignment(assignment);
    onChangeTab("ai");
  };

  const openNewAssignment = () => {
    setFocusedAssignment(null);
    onChangeTab("ai");
  };

  return (
    <main className="wd-container wd-sai-manage-page wd-sai-assignment-page">
      {activeTab === "ai" ? (
        <AssignmentAiPage
          activeTab={activeTab}
          focusedAssignment={focusedAssignment}
          onChangeTab={onChangeTab}
          onMoveAi={openNewAssignment}
        />
      ) : (
        <AssignmentManagePage
          activeTab={activeTab}
          onChangeTab={onChangeTab}
          onMoveAi={openNewAssignment}
          onOpenLinkedAssignments={openLinkedAssignments}
        />
      )}
    </main>
  );
}

function AssignmentPageTabs({
  activeTab,
  onChangeTab,
  onMoveAi
}: {
  activeTab: AssignmentTab;
  onChangeTab: (tab: AssignmentTab) => void;
  onMoveAi: () => void;
}) {
  return (
    <div className="wd-sai-assignment-tabs" role="tablist" aria-label="과제 관리 하위 페이지">
      <button
        className={activeTab === "ai" ? "wd-sai-assignment-tab wd-sai-assignment-tab--active" : "wd-sai-assignment-tab"}
        type="button"
        onClick={onMoveAi}
      >
        과제 AI 생성
      </button>
      <button
        className={activeTab === "manage" ? "wd-sai-assignment-tab wd-sai-assignment-tab--active" : "wd-sai-assignment-tab"}
        type="button"
        onClick={() => onChangeTab("manage")}
      >
        과제 확인/공고 연결
      </button>
    </div>
  );
}

function AssignmentManagePage({
  activeTab,
  onChangeTab,
  onMoveAi,
  onOpenLinkedAssignments
}: {
  activeTab: AssignmentTab;
  onChangeTab: (tab: AssignmentTab) => void;
  onMoveAi: () => void;
  onOpenLinkedAssignments: (assignment: Assignment) => void;
}) {
  const [activeStatus, setActiveStatus] = useState<"all" | AssignmentStatus>("all");
  const [managedAssignments, setManagedAssignments] = useState<Assignment[]>(assignments);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<AssignmentSort>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [notice, setNotice] = useState("");

  const filteredAssignments = useMemo(() => {
    const statusFiltered =
      activeStatus === "all" ? managedAssignments : managedAssignments.filter((item) => item.status === activeStatus);
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const searchFiltered = normalizedQuery
      ? statusFiltered.filter((item) =>
          [item.title, item.jobTitle, ...item.linkedAssignments.map((assignment) => assignment.title)]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        )
      : statusFiltered;
    return [...searchFiltered].sort((first, second) => {
      if (sortOrder === "oldest") {
        return getAssignmentDateValue(first) - getAssignmentDateValue(second);
      }
      if (sortOrder === "jobTitle") {
        const jobTitleCompare = first.jobTitle.localeCompare(second.jobTitle, "ko");
        return jobTitleCompare || getAssignmentDateValue(second) - getAssignmentDateValue(first);
      }
      if (sortOrder === "difficultyHigh") {
        return getAssignmentDifficultyScore(second) - getAssignmentDifficultyScore(first);
      }
      if (sortOrder === "difficultyLow") {
        return getAssignmentDifficultyScore(first) - getAssignmentDifficultyScore(second);
      }
      return getAssignmentDateValue(second) - getAssignmentDateValue(first);
    });
  }, [activeStatus, managedAssignments, searchQuery, sortOrder]);
  const statusCounts = useMemo(
    () => ({
      all: managedAssignments.length,
      draft: managedAssignments.filter((item) => item.status === "draft").length,
      available: managedAssignments.filter((item) => item.status === "available").length,
      linked: managedAssignments.filter((item) => item.status === "linked").length
    }),
    [managedAssignments]
  );

  const toggleSelected = (id: string) => {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));
  };

  const clearSelectedAssignments = () => {
    setSelectedIds([]);
  };

  const deleteSelectedAssignments = () => {
    const deleteCount = selectedIds.length;
    const hasLinkedAssignment = managedAssignments.some((item) => selectedIds.includes(item.id) && item.status === "linked");
    if (hasLinkedAssignment && !window.confirm("공고연결 완료 과제가 포함되어 있어요. 선택한 과제를 삭제할까요?")) {
      return;
    }
    setManagedAssignments((items) => items.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setNotice(`선택한 과제 ${deleteCount}개를 삭제했어요.`);
  };

  const requestAssignment = (assignment: Assignment) => {
    setNotice(`${assignment.title}의 미제출자 ${assignment.applicantsPending}명에게 과제 작성 요청을 보냈어요.`);
  };

  const connectAssignment = (assignment: Assignment) => {
    setNotice(`${assignment.title}을 새로운 공고에 연결할 수 있어요.`);
  };

  return (
    <div className={selectedIds.length > 0 ? "wd-sai-manage-content wd-sai-manage-content--selection" : "wd-sai-manage-content"}>
      <AssignmentPageTabs activeTab={activeTab} onChangeTab={onChangeTab} onMoveAi={onMoveAi} />

      <section
        className={
          selectedIds.length > 0
            ? "wd-sai-manage-list-panel wd-sai-manage-list-panel--selection"
            : "wd-sai-manage-list-panel"
        }
        aria-label="과제 확인 및 공고 연결 목록"
      >
        <div className="wd-sai-toolbar">
          <div className="wd-sai-tabs" role="tablist" aria-label="과제 상태">
            {[
              ["all", "전체", statusCounts.all],
              ["draft", "임시저장", statusCounts.draft],
              ["available", "공고연결 대기", statusCounts.available],
              ["linked", "공고연결 완료", statusCounts.linked]
            ].map(([value, label, count]) => (
              <button
                className={activeStatus === value ? "wd-sai-tab wd-sai-tab--active" : "wd-sai-tab"}
                key={value}
                type="button"
                onClick={() => setActiveStatus(value as "all" | AssignmentStatus)}
              >
                {label}
                <span>{count}</span>
              </button>
            ))}
          </div>
          <label className="wd-sai-search">
            <span>과제 검색</span>
            <input
              aria-label="공고명 또는 채용직무 검색"
              placeholder="공고명 또는 채용직무 검색"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
          <select
            className="wd-sai-sort"
            aria-label="정렬"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as AssignmentSort)}
          >
            <option value="latest">최신 등록순</option>
            <option value="oldest">오래된 등록순</option>
            <option value="jobTitle">채용직무순</option>
            <option value="difficultyHigh">난이도 높은순</option>
            <option value="difficultyLow">난이도 낮은순</option>
          </select>
        </div>

        {selectedIds.length > 0 && (
          <div className="wd-sai-selection-bar" role="status">
            <strong>선택 {selectedIds.length}개</strong>
            <div>
              <button className="wd-sai-clear-filter-selection" type="button" onClick={clearSelectedAssignments}>
                선택해제
              </button>
              <button className="wd-sai-clear-filter-selection wd-sai-clear-filter-selection--danger" type="button" onClick={deleteSelectedAssignments}>
                선택삭제
              </button>
            </div>
          </div>
        )}

        {notice && <div className="wd-sai-toast" role="status">{notice}</div>}

        <div className="wd-sai-task-grid" aria-label="과제 목록">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              assignment={assignment}
              isSelected={selectedIds.includes(assignment.id)}
              key={assignment.id}
              onConnectAssignment={connectAssignment}
              onOpenLinkedAssignments={onOpenLinkedAssignments}
              onRequest={requestAssignment}
              onToggleSelected={toggleSelected}
            />
          ))}
        </div>
      </section>

    </div>
  );
}

function AssignmentCard({
  assignment,
  isSelected,
  onConnectAssignment,
  onOpenLinkedAssignments,
  onRequest,
  onToggleSelected
}: {
  assignment: Assignment;
  isSelected: boolean;
  onConnectAssignment: (assignment: Assignment) => void;
  onOpenLinkedAssignments: (assignment: Assignment) => void;
  onRequest: (assignment: Assignment) => void;
  onToggleSelected: (id: string) => void;
}) {
  const difficultyCounts = {
    hard: assignment.linkedAssignments.filter((item) => item.difficulty === "상").length,
    medium: assignment.linkedAssignments.filter((item) => item.difficulty === "중").length,
    easy: assignment.linkedAssignments.filter((item) => item.difficulty === "하").length
  };
  const isLinked = assignment.status === "linked";
  const isDraft = assignment.status === "draft";
  const visibleLinkedAssignments = assignment.linkedAssignments.slice(0, 3);
  const hiddenLinkedAssignmentCount = assignment.linkedAssignments.length - visibleLinkedAssignments.length;

  return (
    <article className="wd-sai-task-card">
      <div className="wd-sai-task-card__top">
        <label className="wd-sai-task-check">
          <input checked={isSelected} onChange={() => onToggleSelected(assignment.id)} type="checkbox" />
          <span className={`wd-sai-badge wd-sai-badge--${assignment.status}`}>{statusLabels[assignment.status]}</span>
        </label>
        <span className="wd-sai-task-date">{assignment.status === "draft" ? `저장일 ${assignment.savedAt}` : `등록일 ${assignment.createdAt}`}</span>
      </div>

      <h2>{assignment.title}</h2>
      <div className="wd-sai-task-meta">
        <span>{assignment.jobTitle}</span>
        <span>{assignment.experienceLevel}</span>
      </div>

      <dl className="wd-sai-task-summary">
        {isLinked && (
          <>
            <div>
              <dt>연결된 공고명</dt>
              <dd>{assignment.linkedJobTitle}</dd>
            </div>
            <div>
              <dt>공고게재 기간</dt>
              <dd>{assignment.postingPeriod}</dd>
            </div>
          </>
        )}
        <div>
          <dt>채용직무</dt>
          <dd>{assignment.jobTitle}</dd>
        </div>
        {isDraft && (
          <div>
            <dt>작성 상태</dt>
            <dd>AI 생성 중 임시저장한 과제입니다.</dd>
          </div>
        )}
        {!isLinked && !isDraft && (
          <div>
            <dt>연결 상태</dt>
            <dd>과제 생성 완료 후 공고 연결을 기다리는 과제입니다.</dd>
          </div>
        )}
        <div>
          <dt>난이도별 문제수</dt>
          <dd>상 {difficultyCounts.hard} · 중 {difficultyCounts.medium} · 하 {difficultyCounts.easy}</dd>
        </div>
      </dl>

      <div className="wd-sai-linked-assignment-list">
        <strong className="wd-sai-linked-assignment-title">생성된 과제</strong>
        <ul>
          {visibleLinkedAssignments.map((linkedAssignment) => (
            <li key={linkedAssignment.title}>{linkedAssignment.title}</li>
          ))}
          {hiddenLinkedAssignmentCount > 0 && <li className="wd-sai-linked-assignment-more">외 {hiddenLinkedAssignmentCount}개 더보기</li>}
        </ul>
      </div>

      <div className={isDraft ? "wd-sai-task-actions wd-sai-task-actions--single" : "wd-sai-task-actions"}>
        {isLinked ? (
          <>
            <button className="wd-button wd-button--secondary" type="button" onClick={() => onOpenLinkedAssignments(assignment)}>
              과제 보기
            </button>
            <button className="wd-button wd-button--primary" type="button" onClick={() => onRequest(assignment)}>
              미제출자 작성요청
            </button>
          </>
        ) : isDraft ? (
          <button className="wd-button wd-button--secondary" type="button" onClick={() => onOpenLinkedAssignments(assignment)}>
            계속 편집하기
          </button>
        ) : (
          <>
            <button className="wd-button wd-button--secondary" type="button" onClick={() => onOpenLinkedAssignments(assignment)}>
              과제 수정/보기
            </button>
            <button className="wd-button wd-button--primary" type="button" onClick={() => onConnectAssignment(assignment)}>
              공고 연결
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function MultiSelectDropdown({
  disabled,
  label,
  onCustom,
  onToggle,
  options,
  selectedValues
}: {
  disabled: boolean;
  label: string;
  onCustom: () => void;
  onToggle: (value: string) => void;
  options: string[];
  selectedValues: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCount = selectedValues.filter(Boolean).length;
  const summary = selectedCount === 0 ? "선택하세요" : selectedCount === 1 ? selectedValues[0] : `${selectedCount}개 선택됨`;

  return (
    <div className="wd-sai-multiselect" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setIsOpen(false);
      }
    }}>
      <button
        aria-expanded={isOpen}
        className="wd-sai-multiselect__button"
        disabled={disabled}
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <span>{summary}</span>
        <strong>▾</strong>
      </button>
      {isOpen && (
        <div className="wd-sai-multiselect__menu" role="group" aria-label={label}>
          {options.map((option) => (
            <label className="wd-sai-check-row" key={option}>
              <input
                checked={selectedValues.includes(option)}
                disabled={disabled}
                onChange={() => onToggle(option)}
                type="checkbox"
              />
              {option}
            </label>
          ))}
          {!disabled && (
            <button className="wd-sai-multiselect__custom" type="button" onClick={onCustom}>
              직접입력
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SingleSelectDropdown({
  disabled,
  label,
  onChange,
  options,
  value
}: {
  disabled: boolean;
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="wd-sai-multiselect" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setIsOpen(false);
      }
    }}>
      <button
        aria-expanded={isOpen}
        className="wd-sai-multiselect__button"
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span>{value || "선택하세요"}</span>
        <strong>▾</strong>
      </button>
      {isOpen && (
        <div className="wd-sai-multiselect__menu" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              aria-selected={value === option}
              className={value === option ? "wd-sai-select-option is-selected" : "wd-sai-select-option"}
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              role="option"
              type="button"
            >
              <span>{option}</span>
              {value === option && <strong>✓</strong>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AssignmentAiPage({
  activeTab,
  focusedAssignment,
  onChangeTab,
  onMoveAi
}: {
  activeTab: AssignmentTab;
  focusedAssignment: Assignment | null;
  onChangeTab: (tab: AssignmentTab) => void;
  onMoveAi: () => void;
}) {
  const [question, setQuestion] = useState<CustomQuestion>(initialQuestion);
  const [seed, setSeed] = useState(0);
  const [showDraftOnly, setShowDraftOnly] = useState(false);
  const [generatedAssignments, setGeneratedAssignments] = useState<GeneratedAssignment[]>(() =>
    Array.from({ length: 10 }, (_, index) => createGeneratedAssignment(index, 0, initialQuestion))
  );
  const isDraftEditing = focusedAssignment?.status === "draft";
  const isWaitingEditing = focusedAssignment?.status === "available";
  const canAppendAssignments = isDraftEditing || isWaitingEditing;
  const isReadOnlyMode = focusedAssignment?.status === "linked";
  const formTitle = isReadOnlyMode ? "과제 기본 정보" : "과제 AI 생성 맞춤 질문";
  const formGuide = isReadOnlyMode
    ? "공고에 연결된 과제의 기본 정보를 확인할 수 있습니다."
    : "맞춤 질문에 답하면 AI가 채용직무에 맞는 과제를 생성합니다.";
  useEffect(() => {
    if (!focusedAssignment) {
      setShowDraftOnly(false);
      setSeed(0);
      setQuestion(initialQuestion);
      setGeneratedAssignments(Array.from({ length: 10 }, (_, index) => createGeneratedAssignment(index, 0, initialQuestion)));
      return;
    }

    setShowDraftOnly(false);
    setQuestion((current) => ({
      ...current,
      jobRole: [focusedAssignment.jobTitle],
      isJobRoleCustom: !getPreset(current.industry).jobRoles.includes(focusedAssignment.jobTitle),
      isRequiredSkillsCustom: false,
      isProductServiceCustom: false,
      isMainWorkCustom: false,
      mainWork: [`${focusedAssignment.title}에 연결된 과제를 검토하고 수정합니다.`]
    }));
    setGeneratedAssignments(
      focusedAssignment.linkedAssignments.map((linkedAssignment, index) => ({
        id: `${focusedAssignment.id}-linked-${index}`,
        title: linkedAssignment.title,
        difficulty: linkedAssignment.difficulty,
        goal: `${focusedAssignment.title} 지원자의 ${focusedAssignment.jobTitle} 실무 역량을 확인합니다.`,
        requirements: `${linkedAssignment.title} 수행 결과를 정리하고 판단 근거를 함께 제출합니다.`,
        evaluation: "문제 이해도 30%, 실행 가능성 30%, 직무 적합성 25%, 전달력 15%",
        status: focusedAssignment.status === "draft" ? "draft" : "generated",
        selected: false
      }))
    );
  }, [focusedAssignment]);

  const selectedCount = generatedAssignments.filter((item) => item.selected).length;
  const generatedDifficultyCounts = useMemo(
    () => ({
      hard: generatedAssignments.filter((item) => item.difficulty === "상").length,
      medium: generatedAssignments.filter((item) => item.difficulty === "중").length,
      easy: generatedAssignments.filter((item) => item.difficulty === "하").length
    }),
    [generatedAssignments]
  );
  const generatedAssignmentTotal =
    generatedDifficultyCounts.hard + generatedDifficultyCounts.medium + generatedDifficultyCounts.easy;
  const visibleGeneratedAssignments = showDraftOnly
    ? generatedAssignments.filter((item) => item.status === "draft")
    : generatedAssignments;
  const currentPreset = getPreset(question.industry);
  const visibleJobRoleOptions = withDirectInput(currentPreset.jobRoles);
  const requiredSkillOptions = withDirectInput(currentPreset.requiredSkills);
  const productServiceOptions = withDirectInput(currentPreset.productServices);
  const mainWorkOptions = withDirectInput(currentPreset.mainWorks);

  const generateAll = () => {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    setShowDraftOnly(false);
    if (canAppendAssignments) {
      setGeneratedAssignments((items) => [
        ...items,
        ...additionalDifficultyPlan.map((difficulty, index) =>
          createGeneratedAssignment(items.length + index, nextSeed, question, difficulty, true)
        )
      ]);
      return;
    }
    setGeneratedAssignments(Array.from({ length: 10 }, (_, index) => createGeneratedAssignment(index, nextSeed, question)));
  };

  const toggleSelected = (targetId: string) => {
    setGeneratedAssignments((items) =>
      items.map((item) => (item.id === targetId ? { ...item, selected: !item.selected } : item))
    );
  };

  const clearSelected = () => {
    setGeneratedAssignments((items) => items.map((item) => ({ ...item, selected: false })));
  };

  const updateGeneratedAssignment = (targetId: string, key: keyof GeneratedAssignment, value: string) => {
    setGeneratedAssignments((items) => items.map((item) => (item.id === targetId ? { ...item, [key]: value } : item)));
  };

  const saveSelectedDrafts = () => {
    setGeneratedAssignments((items) => items.map((item) => (item.selected ? { ...item, status: "draft" } : item)));
  };

  const cancelDraft = (targetId: string) => {
    setGeneratedAssignments((items) =>
      items.map((item) => (item.id === targetId ? { ...item, status: "generated", selected: false } : item))
    );
  };

  const connectSelected = () => {
    setGeneratedAssignments((items) =>
      items.map((item) => (item.selected ? { ...item, status: "registered", selected: false } : item))
    );
  };

  const selectIndustry = (value: string) => {
    if (value === directInputOption) {
      setQuestion({
        ...question,
        industry: "",
        isIndustryCustom: true
      });
      return;
    }

    const preset = getPreset(value);
    setQuestion({
      ...question,
      industry: value,
      isIndustryCustom: false,
      isJobRoleCustom: false,
      isRequiredSkillsCustom: false,
      isProductServiceCustom: false,
      isMainWorkCustom: false,
      jobRole: preset.jobRoles.slice(0, 2),
      requiredSkills: preset.requiredSkills.slice(0, 2),
      productService: preset.productServices.slice(0, 2),
      mainWork: preset.mainWorks.slice(0, 2)
    });
  };

  const toggleJobRole = (value: string) => {
    setQuestion({
      ...question,
      jobRole: question.jobRole.includes(value)
        ? question.jobRole.filter((item) => item !== value)
        : [...question.jobRole, value]
    });
  };

  const useCustomJobRole = () => {
    setQuestion({ ...question, jobRole: [""], isJobRoleCustom: true });
  };

  const toggleRequiredSkill = (value: string) => {
    setQuestion({
      ...question,
      requiredSkills: question.requiredSkills.includes(value)
        ? question.requiredSkills.filter((item) => item !== value)
        : [...question.requiredSkills, value]
    });
  };

  const toggleProductService = (value: string) => {
    setQuestion({
      ...question,
      productService: question.productService.includes(value)
        ? question.productService.filter((item) => item !== value)
        : [...question.productService, value]
    });
  };

  const toggleMainWork = (value: string) => {
    setQuestion({
      ...question,
      mainWork: question.mainWork.includes(value)
        ? question.mainWork.filter((item) => item !== value)
        : [...question.mainWork, value]
    });
  };

  const useCustomRequiredSkills = () => {
    setQuestion({ ...question, requiredSkills: [""], isRequiredSkillsCustom: true });
  };

  const useCustomProductService = () => {
    setQuestion({ ...question, productService: [""], isProductServiceCustom: true });
  };

  const useCustomMainWork = () => {
    setQuestion({ ...question, mainWork: [""], isMainWorkCustom: true });
  };

  return (
    <>
      <AssignmentPageTabs activeTab={activeTab} onChangeTab={onChangeTab} onMoveAi={onMoveAi} />

      <section className="wd-sai-assignment-layout">
        <aside className="wd-panel wd-sai-form-panel" aria-labelledby="assignment-info-title">
        <h2 id="assignment-info-title">{formTitle}</h2>
        <p className="wd-sai-form-guide">{formGuide}</p>
        {isDraftEditing && <span className="wd-sai-edit-mode-badge">임시저장 과제 편집 중</span>}
        {isWaitingEditing && <span className="wd-sai-edit-mode-badge">공고연결 대기 과제 편집 중</span>}
        {isReadOnlyMode && <span className="wd-sai-edit-mode-badge">공고연결 완료 과제 보기</span>}
        <label>
          업종
          {question.isIndustryCustom ? (
            <div className="wd-sai-direct-input-row">
              <input
                aria-label="업종 직접입력"
                autoFocus
                placeholder="업종을 입력하세요"
                value={question.industry}
                onChange={(event) => setQuestion({ ...question, industry: event.target.value })}
                disabled={isReadOnlyMode}
              />
              {!isReadOnlyMode && (
                <button className="wd-sai-inline-reset" type="button" onClick={() => selectIndustry(industryOptions[0])}>
                  목록
                </button>
              )}
            </div>
          ) : (
            <SingleSelectDropdown
              disabled={isReadOnlyMode}
              label="업종"
              onChange={selectIndustry}
              options={industryOptions}
              value={question.industry}
            />
          )}
        </label>
        <label>
          채용직무
          {question.isJobRoleCustom ? (
            <div className="wd-sai-direct-input-row">
              <input
                aria-label="채용직무 직접입력"
                autoFocus
                placeholder="채용직무를 입력하세요"
                value={question.jobRole[0] ?? ""}
                onChange={(event) => setQuestion({ ...question, jobRole: [event.target.value] })}
                disabled={isReadOnlyMode}
              />
              {!isReadOnlyMode && (
                <button className="wd-sai-inline-reset" type="button" onClick={() => setQuestion({ ...question, jobRole: [visibleJobRoleOptions[0]], isJobRoleCustom: false })}>
                  목록
                </button>
              )}
            </div>
          ) : (
            <MultiSelectDropdown
              disabled={isReadOnlyMode}
              label="채용직무"
              onCustom={useCustomJobRole}
              onToggle={toggleJobRole}
              options={currentPreset.jobRoles}
              selectedValues={question.jobRole}
            />
          )}
        </label>
        <label>
          필수 업무 스킬
          {question.isRequiredSkillsCustom ? (
            <div className="wd-sai-direct-input-row">
              <input
                aria-label="필수 업무 스킬 직접입력"
                autoFocus
                placeholder="필수 업무 스킬을 입력하세요"
                value={question.requiredSkills[0] ?? ""}
                onChange={(event) => setQuestion({ ...question, requiredSkills: [event.target.value] })}
                disabled={isReadOnlyMode}
              />
              {!isReadOnlyMode && (
                <button className="wd-sai-inline-reset" type="button" onClick={() => setQuestion({ ...question, requiredSkills: [requiredSkillOptions[0]], isRequiredSkillsCustom: false })}>
                  목록
                </button>
              )}
            </div>
          ) : (
            <MultiSelectDropdown
              disabled={isReadOnlyMode}
              label="필수 업무 스킬"
              onCustom={useCustomRequiredSkills}
              onToggle={toggleRequiredSkill}
              options={currentPreset.requiredSkills}
              selectedValues={question.requiredSkills}
            />
          )}
        </label>
        <label>
          주력 상품 및 서비스
          {question.isProductServiceCustom ? (
            <div className="wd-sai-direct-input-row">
              <input
                aria-label="주력 상품 및 서비스 직접입력"
                autoFocus
                placeholder="주력 상품 및 서비스를 입력하세요"
                value={question.productService[0] ?? ""}
                onChange={(event) => setQuestion({ ...question, productService: [event.target.value] })}
                disabled={isReadOnlyMode}
              />
              {!isReadOnlyMode && (
                <button className="wd-sai-inline-reset" type="button" onClick={() => setQuestion({ ...question, productService: [productServiceOptions[0]], isProductServiceCustom: false })}>
                  목록
                </button>
              )}
            </div>
          ) : (
            <MultiSelectDropdown
              disabled={isReadOnlyMode}
              label="주력 상품 및 서비스"
              onCustom={useCustomProductService}
              onToggle={toggleProductService}
              options={currentPreset.productServices}
              selectedValues={question.productService}
            />
          )}
        </label>
        <label>
          입사 후 주요 업무
          {question.isMainWorkCustom ? (
            <div className="wd-sai-direct-input-row">
              <input
                aria-label="입사 후 주요 업무 직접입력"
                autoFocus
                placeholder="입사 후 주요 업무를 입력하세요"
                value={question.mainWork[0] ?? ""}
                onChange={(event) => setQuestion({ ...question, mainWork: [event.target.value] })}
                disabled={isReadOnlyMode}
              />
              {!isReadOnlyMode && (
                <button className="wd-sai-inline-reset" type="button" onClick={() => setQuestion({ ...question, mainWork: [mainWorkOptions[0]], isMainWorkCustom: false })}>
                  목록
                </button>
              )}
            </div>
          ) : (
            <MultiSelectDropdown
              disabled={isReadOnlyMode}
              label="입사 후 주요 업무"
              onCustom={useCustomMainWork}
              onToggle={toggleMainWork}
              options={currentPreset.mainWorks}
              selectedValues={question.mainWork}
            />
          )}
        </label>
        <label>
          추가 요청사항
          <textarea
            value={question.additionalRequest}
            onChange={(event) => setQuestion({ ...question, additionalRequest: event.target.value })}
            disabled={isReadOnlyMode}
          />
        </label>
        {!isReadOnlyMode && (
          <button className="wd-button wd-button--primary wd-sai-full-button" type="button" onClick={generateAll}>
            {canAppendAssignments ? "과제 추가 생성" : "과제 AI 생성"}
          </button>
        )}
      </aside>

      <div className={isReadOnlyMode || selectedCount === 0 ? "wd-sai-generated-shell wd-sai-generated-shell--single" : "wd-sai-generated-shell"}>
        <section className="wd-panel wd-sai-generated-panel" aria-labelledby="generated-title">
          <div className="wd-sai-generated-head">
            <div>
              <h2 id="generated-title">생성된 과제</h2>
              <p>
                상 {generatedDifficultyCounts.hard}개, 중 {generatedDifficultyCounts.medium}개, 하 {generatedDifficultyCounts.easy}개로 총{" "}
                {generatedAssignmentTotal}개의 과제가 구성되며,{" "}
                {isReadOnlyMode ? "내용은 보기 전용입니다." : "각 항목은 직접 수정하여 임시저장할 수 있습니다."}
                {!isReadOnlyMode && " 필요한 과제를 선택하여 공고에 연결할 수 있습니다."}
              </p>
            </div>
          </div>

          <div className="wd-sai-assignment-list">
            {visibleGeneratedAssignments.map((assignment, index) => (
              <article className="wd-sai-assignment-card" key={assignment.id}>
                <div className="wd-sai-assignment-card__top">
                  <label className="wd-sai-check-row">
                    {!isReadOnlyMode && (
                      <input
                        type="checkbox"
                        checked={assignment.selected}
                        onChange={() => toggleSelected(assignment.id)}
                        aria-label={`${assignment.title} 선택`}
                      />
                    )}
                    <strong>{index + 1}.</strong>
                    <span
                      className={`wd-sai-badge wd-sai-badge--${
                        assignment.status === "registered"
                          ? "success"
                          : assignment.status === "draft"
                            ? "neutral"
                            : assignment.difficulty === "상"
                              ? "danger"
                              : assignment.difficulty === "중"
                                ? "warning"
                                : "info"
                      }`}
                    >
                      {assignment.status === "registered" ? "공고연결 완료" : assignment.status === "draft" ? "임시저장" : assignment.difficulty}
                    </span>
                    {assignment.isAdditional && <span className="wd-sai-badge wd-sai-badge--addition">추가</span>}
                    {showDraftOnly && assignment.status === "draft" && (
                      <button className="wd-sai-inline-cancel" type="button" onClick={() => cancelDraft(assignment.id)}>
                        저장취소
                      </button>
                    )}
                  </label>
                </div>

                <label>
                  과제명
                  <input
                    value={assignment.title}
                    onChange={(event) => updateGeneratedAssignment(assignment.id, "title", event.target.value)}
                    readOnly={isReadOnlyMode}
                  />
                </label>
                <label>
                  과제 목표
                  <textarea
                    value={assignment.goal}
                    onChange={(event) => updateGeneratedAssignment(assignment.id, "goal", event.target.value)}
                    readOnly={isReadOnlyMode}
                  />
                </label>
                <label>
                  제출 조건
                  <textarea
                    value={assignment.requirements}
                    onChange={(event) => updateGeneratedAssignment(assignment.id, "requirements", event.target.value)}
                    readOnly={isReadOnlyMode}
                  />
                </label>
                <label>
                  평가 기준
                  <textarea
                    value={assignment.evaluation}
                    onChange={(event) => updateGeneratedAssignment(assignment.id, "evaluation", event.target.value)}
                    readOnly={isReadOnlyMode}
                  />
                </label>
              </article>
            ))}
          </div>
        </section>

        {!isReadOnlyMode && selectedCount > 0 && (
          <aside className="wd-sai-register-bar" aria-label="생성된 과제 작업">
            <strong>선택 {selectedCount}개</strong>
            <div className="wd-sai-register-actions">
              <button className="wd-button wd-button--secondary" type="button" disabled={selectedCount === 0} onClick={clearSelected}>
                선택해제
              </button>
              <button className="wd-button wd-button--secondary" type="button" disabled={selectedCount === 0} onClick={saveSelectedDrafts}>
                임시저장
              </button>
              <button className="wd-button wd-button--secondary" type="button" onClick={() => setShowDraftOnly((value) => !value)}>
                {showDraftOnly ? "전체 보기" : "임시저장 보기"}
              </button>
              <button className="wd-button wd-button--primary" type="button" disabled={selectedCount === 0} onClick={connectSelected}>
                공고연결
              </button>
            </div>
          </aside>
        )}
      </div>
      </section>
    </>
  );
}
