import { useEffect, useMemo, useState } from "react";
import { PageContainer } from "../../components/common/PageContainer";
import { CompanyHeaderNav } from "../../components/company/CompanyHeaderNav";
import { directInputOption, getJobRolesByIndustry, industryOptions as baseIndustryOptions } from "../../constants/jobOptions";
import { assignmentDbMock, assignmentDbOptions, type AssignmentDbItem } from "../../mocks/assignmentDb";

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

const assignmentPageSize = 10;

function toDifficulty(value: string): Difficulty {
  return value === "상" || value === "중" || value === "하" ? value : "중";
}

function formatAssignmentDate(index: number) {
  const day = 16 - (index % 14);
  return `2026.07.${String(day).padStart(2, "0")}`;
}

function mapDbItemToManagedAssignment(item: AssignmentDbItem, index: number): Assignment {
  return {
    id: item.assignmentId,
    status: item.status,
    createdAt: formatAssignmentDate(index),
    savedAt: item.status === "draft" ? formatAssignmentDate(index) : undefined,
    title: item.title,
    jobTitle: item.occupation,
    experienceLevel: `난이도 ${item.seniority}`,
    linkedAssignments: [{ title: item.title, difficulty: toDifficulty(item.seniority) }],
    applicantsPending: item.status === "linked" ? Math.max(1, item.adoptionCount) : 0
  };
}

const assignments: Assignment[] = assignmentDbMock.map(mapDbItemToManagedAssignment);

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

const industryOptions: string[] = [...baseIndustryOptions, directInputOption];
const allJobRoleOptions: string[] = [...assignmentDbOptions.occupations, directInputOption];

const initialDbItem = assignmentDbMock[0];

const initialQuestion: CustomQuestion = {
  industry: "",
  jobRole: "",
  isIndustryCustom: false,
  isJobRoleCustom: false,
  requiredSkills: "",
  productService: "",
  mainWork: "",
  additionalRequest: ""
};

function includesQuery(source: string, query: string) {
  return source.toLowerCase().includes(query.trim().toLowerCase());
}

function getMatchingDbItems(question: CustomQuestion, offset = 0, limit = 10) {
  const exactMatches = assignmentDbMock.filter(
    (item) => item.businessField === question.industry && item.occupation === question.jobRole
  );
  const jobMatches = assignmentDbMock.filter((item) => item.occupation === question.jobRole);
  const industryMatches = assignmentDbMock.filter((item) => item.businessField === question.industry);
  const textMatches = assignmentDbMock.filter((item) => {
    const query = [question.industry, question.jobRole].filter(Boolean).join(" ");
    return query ? includesQuery([item.businessField, item.occupation, item.title].join(" "), query) : false;
  });
  const ordered = [...exactMatches, ...jobMatches, ...industryMatches, ...textMatches, ...assignmentDbMock];
  const uniqueItems = ordered.filter(
    (item, index, items) => items.findIndex((candidate) => candidate.assignmentId === item.assignmentId) === index
  );

  return uniqueItems.slice(offset, offset + limit);
}

function mapDbItemToGeneratedAssignment(item: AssignmentDbItem, index: number, isAdditional = false): GeneratedAssignment {
  return {
    id: item.assignmentId,
    title: item.title,
    difficulty: toDifficulty(item.seniority),
    goal: item.summary,
    requirements: item.submitCondition,
    evaluation: item.evaluationCriteria,
    status: "generated",
    selected: false,
    isAdditional
  };
}

function createGeneratedAssignmentsFromDb(question: CustomQuestion, offset = 0, limit = 10, isAdditional = false) {
  return getMatchingDbItems(question, offset, limit).map((item, index) =>
    mapDbItemToGeneratedAssignment(item, offset + index, isAdditional)
  );
}

function getUniqueQuestionOptions(values: string[]) {
  return Array.from(
    new Set(
      values
        .flatMap((value) => value.split(/[,，\n]/))
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

function getPaginationItems(currentPage: number, pageCount: number) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (currentPage >= pageCount - 2) {
    pages.add(pageCount - 3);
    pages.add(pageCount - 2);
    pages.add(pageCount - 1);
  }

  const sortedPages = Array.from(pages)
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((first, second) => first - second);

  return sortedPages.reduce<(number | "ellipsis")[]>((items, page, index) => {
    const previousPage = sortedPages[index - 1];
    if (previousPage && page - previousPage > 1) {
      items.push("ellipsis");
    }
    items.push(page);
    return items;
  }, []);
}

function findDbItemByAssignment(assignment: Assignment, linkedAssignment: LinkedAssignment) {
  return (
    assignmentDbMock.find((item) => item.assignmentId === assignment.id) ??
    assignmentDbMock.find((item) => item.title === linkedAssignment.title)
  );
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
  const [currentPage, setCurrentPage] = useState(1);

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
  const pageCount = Math.max(1, Math.ceil(filteredAssignments.length / assignmentPageSize));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const pageStartIndex = (safeCurrentPage - 1) * assignmentPageSize;
  const paginatedAssignments = filteredAssignments.slice(pageStartIndex, pageStartIndex + assignmentPageSize);
  const pageRangeStart = filteredAssignments.length === 0 ? 0 : pageStartIndex + 1;
  const pageRangeEnd = Math.min(pageStartIndex + paginatedAssignments.length, filteredAssignments.length);
  const paginationItems = getPaginationItems(safeCurrentPage, pageCount);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus, searchQuery, sortOrder]);

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

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
              aria-label="공고명 또는 직무 검색"
              placeholder="공고명 또는 직무 검색"
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
            <option value="jobTitle">직무순</option>
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
          {paginatedAssignments.map((assignment) => (
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
        <nav className="wd-sai-pagination" aria-label="과제 목록 페이지">
          <p>
            전체 {filteredAssignments.length}개 중 {pageRangeStart}-{pageRangeEnd}개 표시
          </p>
          <div>
            <button type="button" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>
              이전
            </button>
            {paginationItems.map((page, index) =>
              page === "ellipsis" ? (
                <span className="wd-sai-pagination__ellipsis" key={`ellipsis-${index}`} aria-hidden="true">
                  ...
                </span>
              ) : (
                <button
                  className={safeCurrentPage === page ? "is-active" : ""}
                  key={page}
                  type="button"
                  aria-current={safeCurrentPage === page ? "page" : undefined}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}
            <button
              type="button"
              disabled={safeCurrentPage === pageCount}
              onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
            >
              다음
            </button>
          </div>
        </nav>
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
          <dt>직무</dt>
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssignments, setGeneratedAssignments] = useState<GeneratedAssignment[]>([]);
  const isDraftEditing = focusedAssignment?.status === "draft";
  const isWaitingEditing = focusedAssignment?.status === "available";
  const canAppendAssignments = isDraftEditing || isWaitingEditing;
  const isReadOnlyMode = focusedAssignment?.status === "linked";
  const formTitle = isReadOnlyMode ? "과제 기본 정보" : "과제 AI 생성 맞춤 질문";
  const formGuide = isReadOnlyMode
    ? "공고에 연결된 과제의 기본 정보를 확인할 수 있습니다."
    : "맞춤 질문에 답하면 실제 과제 DB에서 직무에 맞는 과제를 불러옵니다.";
  useEffect(() => {
    if (!focusedAssignment) {
      setShowDraftOnly(false);
      setSeed(0);
      setQuestion(initialQuestion);
      setGeneratedAssignments([]);
      setIsGenerating(false);
      return;
    }

    setShowDraftOnly(false);
    const focusedDbItem = focusedAssignment.linkedAssignments[0]
      ? findDbItemByAssignment(focusedAssignment, focusedAssignment.linkedAssignments[0])
      : undefined;
    setQuestion((current) => ({
      ...current,
      industry: focusedDbItem?.businessField ?? current.industry,
      jobRole: focusedAssignment.jobTitle,
      isIndustryCustom: focusedDbItem ? !industryOptions.includes(focusedDbItem.businessField) : current.isIndustryCustom,
      isJobRoleCustom: !allJobRoleOptions.includes(focusedAssignment.jobTitle),
      mainWork: `${focusedAssignment.title}에 연결된 과제를 검토하고 수정합니다.`
    }));
    setGeneratedAssignments(
      focusedAssignment.linkedAssignments.map((linkedAssignment, index) => {
        const dbItem = findDbItemByAssignment(focusedAssignment, linkedAssignment);
        const assignment = dbItem
          ? mapDbItemToGeneratedAssignment(dbItem, index)
          : {
              id: `${focusedAssignment.id}-linked-${index}`,
              title: linkedAssignment.title,
              difficulty: linkedAssignment.difficulty,
              goal: "",
              requirements: "",
              evaluation: "",
              status: "generated" as const,
              selected: false
            };

        return {
          ...assignment,
          status: focusedAssignment.status === "draft" ? "draft" : assignment.status
        };
      })
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
  const matchingQuestionDbItems = useMemo(() => {
    if (!question.industry || !question.jobRole) return [];
    const exactMatches = assignmentDbMock.filter(
      (item) => item.businessField === question.industry && item.occupation === question.jobRole
    );
    if (exactMatches.length > 0) return exactMatches;
    const fallbackMatches = getMatchingDbItems(question, 0, 20);
    return fallbackMatches.length > 0 ? fallbackMatches : assignmentDbMock.slice(0, 20);
  }, [question.industry, question.jobRole]);
  const requiredSkillOptions = useMemo(
    () => getUniqueQuestionOptions(matchingQuestionDbItems.map((item) => item.requiredSkills)),
    [matchingQuestionDbItems]
  );
  const productServiceOptions = useMemo(
    () => getUniqueQuestionOptions(matchingQuestionDbItems.map((item) => item.mainProducts)),
    [matchingQuestionDbItems]
  );
  const mainWorkOptions = useMemo(
    () => getUniqueQuestionOptions(matchingQuestionDbItems.map((item) => item.mainTasks)),
    [matchingQuestionDbItems]
  );
  const isQuestionReady = Boolean(
    question.industry && question.jobRole && question.requiredSkills && question.productService && question.mainWork
  );

  const generateAll = () => {
    if (!isQuestionReady || isGenerating) return;
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    setShowDraftOnly(false);
    setIsGenerating(true);
    setGeneratedAssignments(canAppendAssignments ? generatedAssignments : []);
    window.setTimeout(() => {
      if (canAppendAssignments) {
        setGeneratedAssignments((items) => [
          ...items,
          ...createGeneratedAssignmentsFromDb(question, items.length, 5, true)
        ]);
        setIsGenerating(false);
        return;
      }
      setGeneratedAssignments(createGeneratedAssignmentsFromDb(question, nextSeed * 10));
      setIsGenerating(false);
    }, 900);
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
    const isCustomIndustry = value === directInputOption;
    setQuestion({
      ...question,
      industry: isCustomIndustry ? "" : value,
      jobRole: "",
      requiredSkills: "",
      productService: "",
      mainWork: "",
      isIndustryCustom: isCustomIndustry,
      isJobRoleCustom: isCustomIndustry
    });
  };

  const selectJobRole = (value: string) => {
    setQuestion({
      ...question,
      jobRole: value === directInputOption ? "" : value,
      requiredSkills: "",
      productService: "",
      mainWork: "",
      isJobRoleCustom: value === directInputOption
    });
  };

  const jobRoleOptionsForIndustry = question.isIndustryCustom
    ? [directInputOption]
    : [...getJobRolesByIndustry(question.industry), directInputOption];
  const isJobRoleDisabled = !question.industry && !question.isIndustryCustom;

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
              <option value="">업종 선택</option>
              {industryOptions.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          )}
        </label>
        <label>
          직무
          {question.isJobRoleCustom ? (
            <div className="wd-sai-direct-input-row">
              <input
                aria-label="직무 직접입력"
                autoFocus
                placeholder="직무를 입력하세요"
                value={question.jobRole}
                onChange={(event) => setQuestion({ ...question, jobRole: event.target.value })}
                disabled={isReadOnlyMode}
              />
              {!isReadOnlyMode && (
                <button
                  className="wd-sai-inline-reset"
                  type="button"
                  onClick={() => selectJobRole(jobRoleOptionsForIndustry[0] ?? directInputOption)}
                >
                  목록
                </button>
              )}
            </div>
          ) : (
            <select
              value={question.jobRole}
              onChange={(event) => selectJobRole(event.target.value)}
              disabled={isReadOnlyMode || isJobRoleDisabled}
            >
              <option value="">{isJobRoleDisabled ? "업종을 먼저 선택하세요" : "직무 선택"}</option>
              {jobRoleOptionsForIndustry.map((jobRole) => (
                <option key={jobRole} value={jobRole}>{jobRole}</option>
              ))}
            </select>
          )}
        </label>
        <label>
          필수 업무 스킬
          <select
            value={question.requiredSkills}
            onChange={(event) => setQuestion({ ...question, requiredSkills: event.target.value })}
            disabled={isReadOnlyMode || requiredSkillOptions.length === 0}
          >
            <option value="">{requiredSkillOptions.length === 0 ? "업종과 직무를 먼저 선택하세요" : "필수 업무 스킬 선택"}</option>
            {requiredSkillOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          주력 상품 및 서비스
          <select
            value={question.productService}
            onChange={(event) => setQuestion({ ...question, productService: event.target.value })}
            disabled={isReadOnlyMode || productServiceOptions.length === 0}
          >
            <option value="">{productServiceOptions.length === 0 ? "업종과 직무를 먼저 선택하세요" : "주력 상품 및 서비스 선택"}</option>
            {productServiceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          입사 후 주요 업무
          <select
            value={question.mainWork}
            onChange={(event) => setQuestion({ ...question, mainWork: event.target.value })}
            disabled={isReadOnlyMode || mainWorkOptions.length === 0}
          >
            <option value="">{mainWorkOptions.length === 0 ? "업종과 직무를 먼저 선택하세요" : "입사 후 주요 업무 선택"}</option>
            {mainWorkOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
          <button
            className="wd-button wd-button--primary wd-sai-full-button"
            type="button"
            disabled={!isQuestionReady || isGenerating}
            onClick={generateAll}
          >
            {isGenerating ? "과제 AI 생성중입니다" : canAppendAssignments ? "과제 추가 생성" : "과제 AI 생성"}
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

          {isGenerating ? (
            <div className="wd-sai-loading-state" role="status">
              <span className="wd-sai-loading-spinner" aria-hidden="true" />
              <strong>과제 AI 생성중입니다</strong>
              <p>선택한 조건과 실제 과제 DB를 비교해 가장 가까운 과제를 불러오고 있어요.</p>
            </div>
          ) : visibleGeneratedAssignments.length === 0 ? (
            <div className="wd-sai-empty-state">
              <strong>아직 생성된 과제가 없습니다.</strong>
              <p>업종, 직무, 필수 업무 스킬, 주력 상품 및 서비스, 입사 후 주요 업무를 선택한 뒤 과제 AI 생성을 눌러주세요.</p>
            </div>
          ) : null}

          {!isGenerating && visibleGeneratedAssignments.length > 0 ? (
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
          ) : null}
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
