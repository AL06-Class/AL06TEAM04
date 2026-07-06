import { useEffect, useMemo, useState } from "react";
import aiAssignmentIcon from "./assets/ai-assignment-icon.svg";
import gangnamMapMockup from "./assets/map-mockup-gangnam.png";
import wonderdogsLogo from "./assets/wonderdogs-logo.png";

type Page = "main" | "assignments";
type AssignmentTab = "ai" | "manage";
type Difficulty = "상" | "중" | "하";
type AssignmentStatus = "available" | "linked" | "draft";
type GeneratedStatus = "generated" | "draft" | "registered";

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
  available: "사용 가능",
  linked: "공고 연결됨",
  draft: "임시저장"
};

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

function createGeneratedAssignment(index: number, seed: number, question: CustomQuestion): GeneratedAssignment {
  const difficulty = difficultyPlan[index];
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
    selected: false
  };
}

function App() {
  const [page, setPage] = useState<Page>("main");
  const [assignmentTab, setAssignmentTab] = useState<AssignmentTab>("manage");

  const moveAssignments = (tab: AssignmentTab) => {
    setAssignmentTab(tab);
    setPage("assignments");
  };

  return (
    <div className="wd-page">
      <Header page={page} onMoveMain={() => setPage("main")} onMoveAssignments={() => moveAssignments("manage")} />
      {page === "main" && <MainPage onMoveAssignments={moveAssignments} />}
      {page === "assignments" && <AssignmentPage activeTab={assignmentTab} onChangeTab={setAssignmentTab} />}
    </div>
  );
}

function Header({
  page,
  onMoveMain,
  onMoveAssignments
}: {
  page: Page;
  onMoveMain: () => void;
  onMoveAssignments: () => void;
}) {
  return (
    <header className="wd-header">
      <button className="wd-logo" type="button" onClick={onMoveMain} aria-label="메인으로 이동">
        <img className="wd-logo__image" src={wonderdogsLogo} alt="WONDERDOGs" />
      </button>
      <nav className="wd-nav" aria-label="주요 메뉴">
        <button type="button">인재 찾기</button>
        <button type="button">공고 관리</button>
        <button className={page === "assignments" ? "wd-nav__active" : ""} type="button" onClick={onMoveAssignments}>
          과제관리
        </button>
        <button type="button">지원자 관리</button>
        <button type="button">기업 찾기</button>
      </nav>
      <span className="wd-button wd-button--primary wd-button--compact">기업회원</span>
    </header>
  );
}

function MainPage({ onMoveAssignments }: { onMoveAssignments: (tab: AssignmentTab) => void }) {
  return (
    <main className="wd-container">
      <section className="wd-panel wd-hero" aria-labelledby="main-title">
        <div className="wd-hero__main">
          <div className="wd-hero__copy">
            <div>
              <h1 className="wd-title" id="main-title">
                가까운 유연근무 채용과 실제 업무 과제로 더 정확한 매칭
              </h1>
              <p className="wd-description">
                WONDERDOGs는 위치, 근무 조건, 실무 과제를 함께 보여주는 채용 플랫폼입니다.
              </p>
              <div className="wd-actions">
                <button className="wd-button wd-button--primary" type="button">
                  유연근무 공고
                </button>
              </div>
            </div>
          </div>
          <aside className="wd-preview" aria-label="추천 공고 미리보기">
            <div className="wd-preview__map wd-preview__map--image" style={{ backgroundImage: `url(${gangnamMapMockup})` }}>
              <span className="wd-map-filter">지하철 도보 10분</span>
              <span className="wd-map-location" aria-label="현재 위치" />
              <span className="wd-map-marker wd-map-marker--one" aria-label="추천 공고 1" />
              <span className="wd-map-marker wd-map-marker--two" aria-label="추천 공고 2" />
              <span className="wd-map-marker wd-map-marker--three" aria-label="추천 공고 3" />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function AssignmentPage({
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

  return (
    <main className="wd-container wd-manage-page">
      <div className="wd-assignment-tabs" role="tablist" aria-label="과제관리 하위 페이지">
        <button
          className={activeTab === "ai" ? "wd-assignment-tab wd-assignment-tab--active" : "wd-assignment-tab"}
          type="button"
          onClick={() => onChangeTab("ai")}
        >
          과제 AI 생성
        </button>
        <button
          className={activeTab === "manage" ? "wd-assignment-tab wd-assignment-tab--active" : "wd-assignment-tab"}
          type="button"
          onClick={() => onChangeTab("manage")}
        >
          과제 등록/관리
        </button>
      </div>
      {activeTab === "ai" ? (
        <AssignmentAiPage focusedAssignment={focusedAssignment} />
      ) : (
        <AssignmentManagePage onMoveAi={() => onChangeTab("ai")} onOpenLinkedAssignments={openLinkedAssignments} />
      )}
    </main>
  );
}

function AssignmentManagePage({
  onMoveAi,
  onOpenLinkedAssignments
}: {
  onMoveAi: () => void;
  onOpenLinkedAssignments: (assignment: Assignment) => void;
}) {
  const [activeStatus, setActiveStatus] = useState<"all" | AssignmentStatus>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  const filteredAssignments = activeStatus === "all" ? assignments : assignments.filter((item) => item.status === activeStatus);
  const statusCounts = useMemo(
    () => ({
      all: assignments.length,
      draft: assignments.filter((item) => item.status === "draft").length,
      available: assignments.filter((item) => item.status === "available").length,
      linked: assignments.filter((item) => item.status === "linked").length
    }),
    []
  );

  const toggleSelected = (id: string) => {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));
  };

  const requestAssignment = (assignment: Assignment) => {
    setNotice(`${assignment.title}의 미제출자 ${assignment.applicantsPending}명에게 과제 작성 요청을 보냈어요.`);
  };

  const connectAssignment = (assignment: Assignment) => {
    setNotice(`${assignment.title}을 새로운 공고에 연결할 수 있어요.`);
  };

  return (
    <>
      <section className="wd-manage-head">
        <div>
          <h1 className="wd-page-title">과제 등록/관리</h1>
          <p className="wd-description">기존 공고의 채용직무를 기준으로 과제를 관리하고, 공고 연결 또는 지원자 개별 요청에 활용하세요.</p>
          <p className="wd-inline-guide">인재 검색 또는 찜한 인재에게도 과제를 개별 요청할 수 있어요.</p>
        </div>
        <button className="wd-help-box wd-new-task-box" type="button" onClick={onMoveAi}>
          <span className="wd-help-icon wd-new-task-icon">
            <img src={aiAssignmentIcon} alt="" />
          </span>
          <div>
            <strong>새 과제 등록하기</strong>
            <p>새로운 과제를 등록하고 공고 연결 또는 개별 요청 준비를 시작하세요.</p>
          </div>
        </button>
      </section>

      <div className="wd-toolbar">
        <div className="wd-tabs" role="tablist" aria-label="과제 상태">
          {[
            ["all", "전체", statusCounts.all],
            ["draft", "임시저장", statusCounts.draft],
            ["available", "사용 가능", statusCounts.available],
            ["linked", "공고 연결됨", statusCounts.linked]
          ].map(([value, label, count]) => (
            <button
              className={activeStatus === value ? "wd-tab wd-tab--active" : "wd-tab"}
              key={value}
              type="button"
              onClick={() => setActiveStatus(value as "all" | AssignmentStatus)}
            >
              {label}
              <span>{count}</span>
            </button>
          ))}
        </div>
        <select className="wd-sort" aria-label="정렬">
          <option>최신 등록순</option>
          <option>난이도 높은순</option>
          <option>공고 연결순</option>
        </select>
      </div>

      {notice && <div className="wd-toast" role="status">{notice}</div>}

      <section className="wd-task-grid" aria-label="과제 목록">
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
      </section>

    </>
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

  return (
    <article className="wd-task-card">
      <div className="wd-task-card__top">
        <label className="wd-task-check">
          <input checked={isSelected} onChange={() => onToggleSelected(assignment.id)} type="checkbox" />
          <span className={`wd-badge wd-badge--${assignment.status}`}>{statusLabels[assignment.status]}</span>
        </label>
        <span className="wd-task-date">{assignment.status === "draft" ? `저장일 ${assignment.savedAt}` : `등록일 ${assignment.createdAt}`}</span>
      </div>

      <h2>{assignment.title}</h2>
      <div className="wd-task-meta">
        <span>{assignment.jobTitle}</span>
        <span>{assignment.experienceLevel}</span>
      </div>

      <dl className="wd-task-summary">
        <div>
          <dt>연결된 공고명</dt>
          <dd>{assignment.linkedJobTitle ?? "미연결"}</dd>
        </div>
        <div>
          <dt>채용직무</dt>
          <dd>{assignment.jobTitle}</dd>
        </div>
        <div>
          <dt>난이도별 문제수</dt>
          <dd>상 {difficultyCounts.hard} · 중 {difficultyCounts.medium} · 하 {difficultyCounts.easy}</dd>
        </div>
      </dl>

      <div className="wd-linked-assignment-list">
        <button className="wd-linked-assignment-title" type="button" onClick={() => onOpenLinkedAssignments(assignment)}>
          연결된 과제
        </button>
        <ul>
          {assignment.linkedAssignments.map((linkedAssignment) => (
            <li key={linkedAssignment.title}>{linkedAssignment.title}</li>
          ))}
        </ul>
      </div>

      <div className="wd-task-actions">
        <button className="wd-button wd-button--secondary" type="button" onClick={() => onConnectAssignment(assignment)}>
          NEW 공고 연결
        </button>
        <button className="wd-button wd-button--primary" type="button" onClick={() => onRequest(assignment)}>
          미제출자 작성요청
        </button>
      </div>
    </article>
  );
}

function AssignmentAiPage({ focusedAssignment }: { focusedAssignment: Assignment | null }) {
  const [question, setQuestion] = useState<CustomQuestion>(initialQuestion);
  const [seed, setSeed] = useState(0);
  const [showDraftOnly, setShowDraftOnly] = useState(false);
  const [generatedAssignments, setGeneratedAssignments] = useState<GeneratedAssignment[]>(() =>
    Array.from({ length: 10 }, (_, index) => createGeneratedAssignment(index, 0, initialQuestion))
  );

  useEffect(() => {
    if (!focusedAssignment) return;

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
        status: "generated",
        selected: false
      }))
    );
  }, [focusedAssignment]);

  const selectedCount = generatedAssignments.filter((item) => item.selected).length;
  const visibleGeneratedAssignments = showDraftOnly
    ? generatedAssignments.filter((item) => item.status === "draft")
    : generatedAssignments;

  const generateAll = () => {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    setShowDraftOnly(false);
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
      <section className="wd-manage-head wd-ai-head">
        <div>
          <h1 className="wd-page-title">과제 AI 생성</h1>
          <p className="wd-description">채용직무와 주요 업무를 입력하면 AI가 난이도별 사전과제를 생성합니다.</p>
          <p className="wd-inline-guide">생성된 과제는 직접 수정하고 임시저장 또는 공고연결할 수 있어요.</p>
        </div>
      </section>

      <section className="wd-assignment-layout">
        <aside className="wd-panel wd-form-panel" aria-labelledby="assignment-info-title">
        <h2 id="assignment-info-title">사전과제 AI 생성 맞춤 질문</h2>
        <p className="wd-form-guide">6개의 질문에 답변하면 AI가 자동으로 채용직무 맞춤 사전과제를 생성해줍니다.</p>
        <label>
          업종
          <select value={question.isIndustryCustom ? directInputOption : question.industry} onChange={(event) => selectIndustry(event.target.value)}>
            {industryOptions.map((industry) => (
              <option key={industry}>{industry}</option>
            ))}
          </select>
        </label>
        {question.isIndustryCustom && (
          <label>
            업종 직접입력
            <input value={question.industry} onChange={(event) => setQuestion({ ...question, industry: event.target.value })} />
          </label>
        )}
        <label>
          채용직무
          <select value={question.isJobRoleCustom ? directInputOption : question.jobRole} onChange={(event) => selectJobRole(event.target.value)}>
            {jobRoleOptions.map((jobRole) => (
              <option key={jobRole}>{jobRole}</option>
            ))}
          </select>
        </label>
        {question.isJobRoleCustom && (
          <label>
            채용직무 직접입력
            <input value={question.jobRole} onChange={(event) => setQuestion({ ...question, jobRole: event.target.value })} />
          </label>
        )}
        <label>
          필수 업무 스킬
          <input value={question.requiredSkills} onChange={(event) => setQuestion({ ...question, requiredSkills: event.target.value })} />
        </label>
        <label>
          주력 상품 및 서비스
          <input value={question.productService} onChange={(event) => setQuestion({ ...question, productService: event.target.value })} />
        </label>
        <label>
          입사 후 주요 업무
          <textarea value={question.mainWork} onChange={(event) => setQuestion({ ...question, mainWork: event.target.value })} />
        </label>
        <label>
          추가 요청사항
          <textarea value={question.additionalRequest} onChange={(event) => setQuestion({ ...question, additionalRequest: event.target.value })} />
        </label>
        <button className="wd-button wd-button--primary wd-full-button" type="button" onClick={generateAll}>
          AI 과제 생성
        </button>
      </aside>

      <section className="wd-panel wd-generated-panel" aria-labelledby="generated-title">
        <div className="wd-generated-head">
          <div>
            <h2 id="generated-title">생성된 과제</h2>
            <p>상 4개, 중 3개, 하 3개로 생성됩니다. 필요한 과제를 체크해 등록 준비할 수 있습니다.</p>
            <p>각 항목은 직접 수정한 뒤 임시저장할 수 있습니다.</p>
          </div>
          <button className="wd-clear-selection" type="button" disabled={selectedCount === 0} onClick={clearSelected}>
            체크해제
          </button>
        </div>

        <div className="wd-assignment-list">
          {visibleGeneratedAssignments.map((assignment, index) => (
            <article className="wd-assignment-card" key={assignment.id}>
              <div className="wd-assignment-card__top">
                <label className="wd-check-row">
                  <input
                    type="checkbox"
                    checked={assignment.selected}
                    onChange={() => toggleSelected(assignment.id)}
                    aria-label={`${assignment.title} 선택`}
                  />
                  <span
                    className={`wd-badge wd-badge--${
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
                    {assignment.status === "registered" ? "공고 연결됨" : assignment.status === "draft" ? "임시저장" : assignment.difficulty}
                  </span>
                  {showDraftOnly && assignment.status === "draft" && (
                    <button className="wd-inline-cancel" type="button" onClick={() => cancelDraft(assignment.id)}>
                      저장취소
                    </button>
                  )}
                </label>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
              </div>

              <label>
                과제명
                <input value={assignment.title} onChange={(event) => updateGeneratedAssignment(assignment.id, "title", event.target.value)} />
              </label>
              <label>
                과제 목표
                <textarea value={assignment.goal} onChange={(event) => updateGeneratedAssignment(assignment.id, "goal", event.target.value)} />
              </label>
              <label>
                제출 조건
                <textarea
                  value={assignment.requirements}
                  onChange={(event) => updateGeneratedAssignment(assignment.id, "requirements", event.target.value)}
                />
              </label>
              <label>
                평가 기준
                <textarea
                  value={assignment.evaluation}
                  onChange={(event) => updateGeneratedAssignment(assignment.id, "evaluation", event.target.value)}
                />
              </label>
            </article>
          ))}
        </div>

        <div className="wd-register-bar">
          <strong>선택된 과제 {selectedCount}개</strong>
          <div className="wd-register-actions">
            <button className="wd-button wd-button--secondary" type="button" disabled={selectedCount === 0} onClick={saveSelectedDrafts}>
              임시저장
            </button>
            <button className="wd-button wd-button--secondary" type="button" onClick={() => setShowDraftOnly((value) => !value)}>
              {showDraftOnly ? "전체과제확인" : "임시저장과제확인"}
            </button>
            <button className="wd-button wd-button--primary" type="button" disabled={selectedCount === 0} onClick={connectSelected}>
              공고연결
            </button>
          </div>
        </div>
      </section>
      </section>
    </>
  );
}

export default App;
