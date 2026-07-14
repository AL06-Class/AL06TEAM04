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
  jobRole: string;
  isIndustryCustom: boolean;
  isJobRoleCustom: boolean;
  requiredSkills: string;
  productService: string;
  mainWork: string;
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
    id: "assignment-ux",
    status: "available",
    createdAt: "2024.05.20",
    title: "UX 리서처 채용 공고",
    jobTitle: "UX 리서처",
    experienceLevel: "신입~3년",
    linkedAssignments: [
      { title: "UX 리서치 인터뷰 분석 과제", difficulty: "상" },
      { title: "사용자 여정 개선안 작성", difficulty: "중" }
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
      { title: "데이터 분석 리포트 작성 과제", difficulty: "상" },
      { title: "지표 이상 원인 분석", difficulty: "상" }
    ],
    applicantsPending: 7
  },
  {
    id: "assignment-marketing",
    status: "draft",
    createdAt: "2024.05.17",
    savedAt: "2024.05.17",
    title: "마케팅 매니저 채용 공고",
    jobTitle: "마케팅 매니저",
    experienceLevel: "경력 1~3년",
    linkedAssignments: [{ title: "마케팅 전략 제안 과제", difficulty: "하" }],
    applicantsPending: 0
  },
  {
    id: "assignment-service",
    status: "available",
    createdAt: "2024.05.15",
    title: "서비스 기획자 채용 공고",
    jobTitle: "서비스 기획자",
    experienceLevel: "경력 3~5년",
    linkedAssignments: [
      { title: "서비스 개선안 작성 과제", difficulty: "중" },
      { title: "기능 우선순위 판단 과제", difficulty: "중" }
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
      { title: "프론트엔드 화면 구현 과제", difficulty: "상" },
      { title: "컴포넌트 상태 처리 과제", difficulty: "중" }
    ],
    applicantsPending: 5
  },
  {
    id: "assignment-brand",
    status: "draft",
    createdAt: "2024.05.10",
    savedAt: "2024.05.10",
    title: "브랜드 디자이너 채용 공고",
    jobTitle: "브랜드 디자이너",
    experienceLevel: "신입~3년",
    linkedAssignments: [{ title: "브랜드 디자인 제안 과제", difficulty: "하" }],
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
  jobRole: "콘텐츠 디자이너",
  isIndustryCustom: false,
  isJobRoleCustom: false,
  requiredSkills: "콘텐츠 기획, Figma, 협업 커뮤니케이션",
  productService: "유연근무 채용 플랫폼",
  mainWork: "채용 공고 상세 화면의 핵심 정보를 더 쉽게 읽히게 개선",
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
  "UI/UX 디자이너",
  "콘텐츠 디자이너",
  "마케팅 매니저",
  "서비스 운영 매니저",
  "프로덕트 매니저",
  "데이터 분석가",
  "고객 상담 매니저",
  "채용 담당자",
  directInputOption
];

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

  return {
    id: `generated-${seed}-${index}`,
    title: `${question.jobRole} ${theme}`,
    difficulty,
    goal: `${question.industry} 분야의 ${question.productService} 업무 맥락에서 ${question.jobRole}의 실무 판단력을 확인합니다.`,
    requirements: `${question.mainWork} 상황을 기준으로 문제 정의, 실행안, 필요한 ${question.requiredSkills}, 예상 결과를 정리합니다. ${question.additionalRequest}`,
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
      <section className="wd-sai-manage-head">
        <button className="wd-button wd-button--primary wd-sai-new-task-button" type="button" onClick={onMoveAi}>
          신규 과제 등록
        </button>
      </section>
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
      jobRole: focusedAssignment.jobTitle,
      isJobRoleCustom: !jobRoleOptions.includes(focusedAssignment.jobTitle),
      mainWork: `${focusedAssignment.title}에 연결된 과제를 검토하고 수정합니다.`
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
    setQuestion({
      ...question,
      industry: value === directInputOption ? "" : value,
      isIndustryCustom: value === directInputOption
    });
  };

  const selectJobRole = (value: string) => {
    setQuestion({
      ...question,
      jobRole: value === directInputOption ? "" : value,
      isJobRoleCustom: value === directInputOption
    });
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
            <select
              value={question.industry}
              onChange={(event) => selectIndustry(event.target.value)}
              disabled={isReadOnlyMode}
            >
              {industryOptions.map((industry) => (
                <option key={industry}>{industry}</option>
              ))}
            </select>
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
                value={question.jobRole}
                onChange={(event) => setQuestion({ ...question, jobRole: event.target.value })}
                disabled={isReadOnlyMode}
              />
              {!isReadOnlyMode && (
                <button className="wd-sai-inline-reset" type="button" onClick={() => selectJobRole(jobRoleOptions[0])}>
                  목록
                </button>
              )}
            </div>
          ) : (
            <select
              value={question.jobRole}
              onChange={(event) => selectJobRole(event.target.value)}
              disabled={isReadOnlyMode}
            >
              {jobRoleOptions.map((jobRole) => (
                <option key={jobRole}>{jobRole}</option>
              ))}
            </select>
          )}
        </label>
        <label>
          필수 업무 스킬
          <input
            value={question.requiredSkills}
            onChange={(event) => setQuestion({ ...question, requiredSkills: event.target.value })}
            disabled={isReadOnlyMode}
          />
        </label>
        <label>
          주력 상품 및 서비스
          <input
            value={question.productService}
            onChange={(event) => setQuestion({ ...question, productService: event.target.value })}
            disabled={isReadOnlyMode}
          />
        </label>
        <label>
          입사 후 주요 업무
          <textarea
            value={question.mainWork}
            onChange={(event) => setQuestion({ ...question, mainWork: event.target.value })}
            disabled={isReadOnlyMode}
          />
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
