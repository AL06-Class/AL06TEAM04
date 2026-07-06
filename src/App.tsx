import { useMemo, useState } from "react";
import gangnamMapMockup from "./assets/map-mockup-gangnam.png";
import wonderdogsLogo from "./assets/wonderdogs-logo.png";

type Page = "main" | "assignment-ai";
type Difficulty = "상" | "중" | "하";
type AssignmentStatus = "generated" | "draft" | "registered";

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

type Assignment = {
  id: string;
  title: string;
  difficulty: Difficulty;
  goal: string;
  requirements: string;
  evaluation: string;
  status: AssignmentStatus;
  selected: boolean;
};

const directInputOption = "직접입력";

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

function createAssignment(index: number, seed: number, question: CustomQuestion): Assignment {
  const difficulty = difficultyPlan[index];
  const theme = assignmentThemes[(index + seed) % assignmentThemes.length];
  const role = question.jobRole || "실무 담당자";
  const industry = question.industry || "선택 업종";
  const skill = question.requiredSkills || "필수 업무 스킬";
  const service = question.productService || "주력 상품 및 서비스";
  const work = question.mainWork || "입사 후 주업무";
  const request = question.additionalRequest || "추가 요청사항 없음";

  return {
    id: `assignment-${difficulty}-${index + 1}`,
    title: `${role} ${theme}`,
    difficulty,
    goal: `${industry} 분야의 ${service} 업무 맥락에서 ${role}의 실무 판단력을 확인합니다.`,
    requirements: `${work} 상황을 기준으로 문제 정의, 실행안, 필요한 ${skill}, 예상 결과를 정리합니다. ${request}`,
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

  return (
    <div className="wd-page">
      <Header page={page} onMove={setPage} />
      {page === "main" ? <MainPage /> : <AssignmentAiPage />}
    </div>
  );
}

function Header({ page, onMove }: { page: Page; onMove: (page: Page) => void }) {
  return (
    <header className="wd-header">
      <button className="wd-logo" type="button" onClick={() => onMove("main")} aria-label="메인으로 이동">
        <img className="wd-logo__image" src={wonderdogsLogo} alt="WONDERDOGs" />
      </button>
      <nav className="wd-nav" aria-label="주요 메뉴">
        <button className={page === "main" ? "wd-nav__active" : ""} type="button" onClick={() => onMove("main")}>
          메인
        </button>
        <span>공고 관리</span>
        <button
          className={page === "assignment-ai" ? "wd-nav__active" : ""}
          type="button"
          onClick={() => onMove("assignment-ai")}
        >
          과제 관리
        </button>
        <span>지원자 관리</span>
      </nav>
      <span className="wd-button wd-button--primary wd-button--compact">기업 회원</span>
    </header>
  );
}

function MainPage() {
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
              <span className="wd-map-location" aria-label="내 위치" />
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

function AssignmentAiPage() {
  const [question, setQuestion] = useState<CustomQuestion>(initialQuestion);
  const [seed, setSeed] = useState(0);
  const [showDraftOnly, setShowDraftOnly] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    Array.from({ length: 10 }, (_, index) => createAssignment(index, 0, initialQuestion))
  );

  const selectedCount = useMemo(() => assignments.filter((item) => item.selected).length, [assignments]);
  const visibleAssignments = showDraftOnly ? assignments.filter((item) => item.status === "draft") : assignments;

  const generateAll = () => {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    setShowDraftOnly(false);
    setAssignments(Array.from({ length: 10 }, (_, index) => createAssignment(index, nextSeed, question)));
  };

  const regenerateOne = (targetId: string) => {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    setAssignments((items) =>
      items.map((item, index) => (item.id === targetId ? createAssignment(index, nextSeed, question) : item))
    );
  };

  const updateAssignment = (targetId: string, key: keyof Assignment, value: string) => {
    setAssignments((items) => items.map((item) => (item.id === targetId ? { ...item, [key]: value } : item)));
  };

  const saveDraft = (targetId: string) => {
    setAssignments((items) => items.map((item) => (item.id === targetId ? { ...item, status: "draft" } : item)));
  };

  const saveSelectedDrafts = () => {
    setAssignments((items) => items.map((item) => (item.selected ? { ...item, status: "draft" } : item)));
  };

  const toggleSelected = (targetId: string) => {
    setAssignments((items) =>
      items.map((item) => (item.id === targetId ? { ...item, selected: !item.selected } : item))
    );
  };

  const connectSelected = () => {
    setAssignments((items) =>
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
    <main className="wd-container wd-assignment-page">
      <section className="wd-page-head">
        <div>
          <h1 className="wd-page-title">과제 AI 생성</h1>
        </div>
        <div className="wd-summary-actions" aria-label="과제 관리 동작">
          <strong className="wd-selected-count">선택된 과제 {selectedCount}개</strong>
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
      </section>

      <section className="wd-assignment-layout">
        <aside className="wd-panel wd-form-panel" aria-labelledby="assignment-info-title">
          <h2 id="assignment-info-title">사전과제 AI생성 맞춤 질문</h2>
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
            필수업무스킬
            <input
              value={question.requiredSkills}
              onChange={(event) => setQuestion({ ...question, requiredSkills: event.target.value })}
              placeholder="예: Figma, 데이터 분석, 고객 응대"
            />
          </label>
          <label>
            주력상품 및 서비스
            <input
              value={question.productService}
              onChange={(event) => setQuestion({ ...question, productService: event.target.value })}
              placeholder="예: 유연근무 채용 플랫폼"
            />
          </label>
          <label>
            입사 후 주업무
            <textarea
              value={question.mainWork}
              onChange={(event) => setQuestion({ ...question, mainWork: event.target.value })}
              placeholder="입사 후 맡게 될 주요 업무를 입력하세요."
            />
          </label>
          <label>
            추가 요청사항
            <textarea
              value={question.additionalRequest}
              onChange={(event) => setQuestion({ ...question, additionalRequest: event.target.value })}
              placeholder="원하는 난이도, 제출 형태, 평가 포인트 등을 입력하세요."
            />
          </label>
          <button className="wd-button wd-button--primary wd-full-button" type="button" onClick={generateAll}>
            AI 과제 생성
          </button>
        </aside>

        <section className="wd-panel wd-generated-panel" aria-labelledby="generated-title">
          <div className="wd-generated-head">
            <div>
              <h2 id="generated-title">생성된 과제</h2>
              <p>상 4개, 중 3개, 하 3개로 생성됩니다. 필요한 과제를 체크해 관리할 수 있습니다.</p>
            </div>
            <span className="wd-badge wd-badge--info">{showDraftOnly ? "임시저장" : "총 10개"}</span>
          </div>

          <div className="wd-assignment-list">
            {visibleAssignments.map((assignment, index) => (
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
                  </label>
                  <strong>{String(index + 1).padStart(2, "0")}</strong>
                </div>

                <label>
                  과제명
                  <input value={assignment.title} onChange={(event) => updateAssignment(assignment.id, "title", event.target.value)} />
                </label>
                <label>
                  과제 목표
                  <textarea value={assignment.goal} onChange={(event) => updateAssignment(assignment.id, "goal", event.target.value)} />
                </label>
                <label>
                  제출 조건
                  <textarea
                    value={assignment.requirements}
                    onChange={(event) => updateAssignment(assignment.id, "requirements", event.target.value)}
                  />
                </label>
                <label>
                  평가 기준
                  <textarea
                    value={assignment.evaluation}
                    onChange={(event) => updateAssignment(assignment.id, "evaluation", event.target.value)}
                  />
                </label>

                <div className="wd-card-actions">
                  <button className="wd-button wd-button--secondary" type="button" onClick={() => regenerateOne(assignment.id)}>
                    재생성
                  </button>
                  <button className="wd-button wd-button--secondary" type="button" onClick={() => saveDraft(assignment.id)}>
                    임시저장
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="wd-register-bar">
            <strong>선택된 과제 {selectedCount}개</strong>
            <div className="wd-register-actions">
              <button className="wd-button wd-button--secondary" type="button" disabled={selectedCount === 0} onClick={saveSelectedDrafts}>
                임시저장
              </button>
              <button className="wd-button wd-button--primary" type="button" disabled={selectedCount === 0} onClick={connectSelected}>
                공고연결
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
