import { useMemo, useState, type ReactNode } from "react";

type CreateStep = "company" | "flexible-work" | "work-detail" | "assignment";
type AssignmentStatus = "available" | "linked" | "draft";
type AssignmentOwner = "mine" | "public";
type AssignmentChoice = "new" | "existing";

type Assignment = {
  assignmentId: string;
  owner: AssignmentOwner;
  companyName: string;
  status: AssignmentStatus;
  occupation: string;
  businessField: string;
  seniority: string;
  title: string;
  adoptionCount: number;
  estimatedHours: string;
  summary: string;
  evaluationItems: string[];
};

type JobDraft = {
  companyName: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  title: string;
  occupation: string;
  customOccupation: string;
  businessField: string;
  jobTitle: string;
  customJobTitle: string;
  seniority: string;
  requiredSkillsText: string;
  mainTasks: string;
  preferredQualifications: string;
  workType: string;
  flexibleWorkType: string;
  workDays: string;
  dailyWorkHours: string;
  workStartTime: string;
  workEndTime: string;
  salaryText: string;
};

type AssignmentFilters = {
  occupation: string;
  businessField: string;
  seniority: string;
  keyword: string;
};

const stepMeta: Array<{ id: CreateStep; title: string; description: string }> = [
  { id: "company", title: "회사 기본 정보", description: "회사명, 위치, 담당자 정보" },
  { id: "flexible-work", title: "유연근무 조건", description: "근무 방식, 요일, 시간" },
  { id: "work-detail", title: "업무 상세", description: "직무, 경력, 주요 업무, 역량" },
  { id: "assignment", title: "과제 연결", description: "기존 과제 검색 또는 새 과제 생성" }
];

const occupationOptions = ["UI/UX디자인", "프로덕트 디자인", "웹디자인", "프론트엔드 개발", "서비스 운영", "직접입력"];
const businessFieldOptions = ["IT 서비스", "플랫폼", "이커머스", "라이프스타일", "교육"];
const jobTitleOptions = ["서비스 디자이너", "프로덕트 디자이너", "UX 리서처", "UI 디자이너", "CX 매니저", "직접입력"];
const seniorityOptions = ["주니어(1~3년차)", "주니어(3~5년차)", "미드 레벨(5~10년차)", "시니어(10~15년차)", "경력 무관"];
const workTypeOptions = ["하이브리드", "재택", "출근", "완전 원격"];
const flexibleWorkTypeOptions = ["재택 가능", "하이브리드", "시차 출근", "시간 협의", "유연근무"];
const workDaysOptions = ["월", "화", "수", "목", "금", "토", "일", "협의 가능"];
const dailyWorkHourOptions = ["일 4시간", "일 5시간", "일 6시간", "일 7시간", "일 8시간"];

const timeOptions = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minute = index % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

const assignmentPool: Assignment[] = [
  {
    assignmentId: "assignment_my_ux_01",
    owner: "mine",
    companyName: "원더독스",
    status: "available",
    occupation: "UI/UX디자인",
    businessField: "IT 서비스",
    seniority: "주니어(3~5년차)",
    title: "서비스 개선 아이디어 제안",
    adoptionCount: 12,
    estimatedHours: "3~4시간",
    summary: "서비스 중 하나를 선택해 사용자 경험을 개선할 수 있는 아이디어를 제안합니다.",
    evaluationItems: ["문제 정의", "개선 방향", "기대 효과"]
  },
  {
    assignmentId: "assignment_my_ux_02",
    owner: "mine",
    companyName: "원더독스",
    status: "available",
    occupation: "프로덕트 디자인",
    businessField: "플랫폼",
    seniority: "주니어(3~5년차)",
    title: "Figma 기반 플랫폼 UI/UX 리디자인",
    adoptionCount: 93,
    estimatedHours: "3시간",
    summary: "핵심 화면의 정보 구조와 사용자 흐름을 정리하고 리디자인 방향을 제안합니다.",
    evaluationItems: ["정보 구조", "사용자 흐름", "시각 완성도"]
  },
  {
    assignmentId: "assignment_public_ux_01",
    owner: "public",
    companyName: "유엑스디자인(주)",
    status: "available",
    occupation: "UI/UX디자인",
    businessField: "IT 서비스",
    seniority: "주니어(3~5년차)",
    title: "사용자 리서치 기반 온보딩 개선안",
    adoptionCount: 48,
    estimatedHours: "3시간",
    summary: "온보딩 이탈 원인을 가정하고 개선 화면과 우선순위를 제안합니다.",
    evaluationItems: ["리서치 관점", "우선순위", "실행 가능성"]
  },
  {
    assignmentId: "assignment_public_dev_01",
    owner: "public",
    companyName: "코어플랫폼",
    status: "available",
    occupation: "프론트엔드 개발",
    businessField: "플랫폼",
    seniority: "주니어(3~5년차)",
    title: "반응형 주문 관리 컴포넌트 구현",
    adoptionCount: 15,
    estimatedHours: "3시간",
    summary: "제공된 요구사항을 바탕으로 반응형 컴포넌트를 구현합니다.",
    evaluationItems: ["컴포넌트 구조", "반응형", "접근성"]
  },
  {
    assignmentId: "assignment_public_web_01",
    owner: "public",
    companyName: "펫케어랩",
    status: "available",
    occupation: "웹디자인",
    businessField: "이커머스",
    seniority: "미드 레벨(5~10년차)",
    title: "세로형 상품 상세 페이지 제작",
    adoptionCount: 15,
    estimatedHours: "3시간",
    summary: "상품 상세 페이지의 정보 구조와 구매 전환 흐름을 설계합니다.",
    evaluationItems: ["상세 구성", "전환 흐름", "브랜드 적합성"]
  }
];

const initialJobDraft: JobDraft = {
  companyName: "",
  address: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  title: "",
  occupation: "",
  customOccupation: "",
  businessField: "",
  jobTitle: "",
  customJobTitle: "",
  seniority: "",
  requiredSkillsText: "",
  mainTasks: "",
  preferredQualifications: "",
  workType: "",
  flexibleWorkType: "",
  workDays: "",
  dailyWorkHours: "",
  workStartTime: "",
  workEndTime: "",
  salaryText: ""
};

function getInitialStep(): CreateStep {
  const step = new URLSearchParams(window.location.search).get("step");
  return stepMeta.some((item) => item.id === step) ? (step as CreateStep) : "company";
}

function splitList(value: string) {
  return value
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function currentStepIndex(step: CreateStep) {
  return stepMeta.findIndex((item) => item.id === step);
}

function parseWorkHours(value: string) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function addWorkHoursWithLunch(startTime: string, dailyWorkHours: string) {
  const hours = parseWorkHours(dailyWorkHours);
  if (!startTime || !hours) return "";
  const [hourText, minuteText] = startTime.split(":");
  const startMinutes = Number(hourText) * 60 + Number(minuteText);
  const workMinutes = hours * 60;
  const lunchMinutes = hours >= 4 ? 60 : 0;
  const endMinutes = startMinutes + workMinutes + lunchMinutes;
  const hour = Math.floor(endMinutes / 60) % 24;
  const minute = endMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function getResolvedValue(value: string, customValue: string) {
  return value === "직접입력" ? customValue : value;
}

export function JobPostCreatePage() {
  const [step, setStep] = useState<CreateStep>(getInitialStep);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);
  const [jobDraft, setJobDraft] = useState<JobDraft>(initialJobDraft);
  const [assignmentChoice, setAssignmentChoice] = useState<AssignmentChoice>("new");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(assignmentPool[0].assignmentId);
  const [filters, setFilters] = useState<AssignmentFilters>({
    occupation: "",
    businessField: "",
    seniority: "",
    keyword: ""
  });

  const resolvedOccupation = getResolvedValue(jobDraft.occupation, jobDraft.customOccupation);
  const resolvedJobTitle = getResolvedValue(jobDraft.jobTitle, jobDraft.customJobTitle);

  const filteredAssignments = useMemo(() => {
    return assignmentPool
      .filter((assignment) => {
        const keyword = filters.keyword.trim();
        return (
          (!filters.occupation || assignment.occupation === filters.occupation) &&
          (!filters.businessField || assignment.businessField === filters.businessField) &&
          (!filters.seniority || assignment.seniority === filters.seniority) &&
          (!keyword || assignment.title.includes(keyword) || assignment.companyName.includes(keyword))
        );
      })
      .sort((a, b) => {
        if (a.owner !== b.owner) return a.owner === "mine" ? -1 : 1;
        return b.adoptionCount - a.adoptionCount;
      });
  }, [filters]);

  const selectedAssignment =
    assignmentChoice === "existing"
      ? assignmentPool.find((assignment) => assignment.assignmentId === selectedAssignmentId) ?? null
      : null;
  const completePath = "/company/job-posts/job-posting-2026-07-001/complete";

  const updateJobDraft = (field: keyof JobDraft, value: string) => {
    setJobDraft((current) => {
      const next = { ...current, [field]: value };
      if (field === "workStartTime" || field === "dailyWorkHours") {
        next.workEndTime = addWorkHoursWithLunch(
          field === "workStartTime" ? value : current.workStartTime,
          field === "dailyWorkHours" ? value : current.dailyWorkHours
        );
      }
      if (field === "occupation") setFilters((currentFilters) => ({ ...currentFilters, occupation: value }));
      if (field === "businessField") setFilters((currentFilters) => ({ ...currentFilters, businessField: value }));
      if (field === "seniority") setFilters((currentFilters) => ({ ...currentFilters, seniority: value }));
      return next;
    });
  };

  const goToStep = (nextStep: CreateStep) => {
    setStep(nextStep);
    window.history.replaceState(null, "", `/company/job-posts/new?step=${nextStep}`);
  };

  const moveStep = (direction: 1 | -1) => {
    const nextIndex = Math.min(Math.max(currentStepIndex(step) + direction, 0), stepMeta.length - 1);
    goToStep(stepMeta[nextIndex].id);
  };

  const previewJob = {
    ...jobDraft,
    occupation: resolvedOccupation,
    jobTitle: resolvedJobTitle
  };

  if (isFullPreviewOpen) {
    return (
      <FullJobPostPreview
        assignment={selectedAssignment}
        jobDraft={previewJob}
        onBack={() => setIsFullPreviewOpen(false)}
        onComplete={() => {
          window.history.pushState(null, "", completePath);
          window.dispatchEvent(new Event("wd:navigate"));
        }}
      />
    );
  }

  return (
    <main className="wd-container wd-create-page">
      <div className="wd-page-heading">
        <div>
          <p className="wd-eyebrow">공고 관리 / 새 공고 등록</p>
          <h1 className="wd-page-title">새 공고 등록하기</h1>
          <p className="wd-lead">공고관리에서 새 공고 등록하기를 눌렀을 때 이어지는 등록 화면입니다.</p>
        </div>
        <button className="wd-button wd-button--secondary" type="button">임시 저장</button>
      </div>

      <div className="wd-create-layout">
        <section className="wd-create-main">
          <Stepper currentStep={step} onStepChange={goToStep} />
          {step === "company" && <CompanyInfoStep draft={jobDraft} onChange={updateJobDraft} />}
          {step === "flexible-work" && <FlexibleWorkStep draft={jobDraft} onChange={updateJobDraft} />}
          {step === "work-detail" && <WorkDetailStep draft={jobDraft} onChange={updateJobDraft} />}
          {step === "assignment" && (
            <AssignmentStep
              assignmentChoice={assignmentChoice}
              filters={filters}
              filteredAssignments={filteredAssignments}
              selectedAssignmentId={selectedAssignmentId}
              onAssignmentChoiceChange={setAssignmentChoice}
              onExistingAssignmentChange={setSelectedAssignmentId}
              onFilterChange={(field, value) => setFilters((current) => ({ ...current, [field]: value }))}
            />
          )}
          <FooterActions
            canMoveNext={currentStepIndex(step) < stepMeta.length - 1}
            canMovePrevious={currentStepIndex(step) > 0}
            hasAssignment={Boolean(selectedAssignment)}
            onComplete={() => {
              window.history.pushState(null, "", completePath);
              window.dispatchEvent(new Event("wd:navigate"));
            }}
            onFullPreview={() => setIsFullPreviewOpen(true)}
            onMoveNext={() => moveStep(1)}
            onMovePrevious={() => moveStep(-1)}
          />
        </section>
        <JobPostPreviewPanel assignment={selectedAssignment} jobDraft={previewJob} />
      </div>
    </main>
  );
}

function Stepper({ currentStep, onStepChange }: { currentStep: CreateStep; onStepChange: (step: CreateStep) => void }) {
  const activeIndex = currentStepIndex(currentStep);
  return (
    <ol className="wd-stepper" aria-label="공고 등록 단계">
      {stepMeta.map((item, index) => {
        const state = index < activeIndex ? "complete" : index === activeIndex ? "current" : "upcoming";
        return (
          <li key={item.id}>
            <button className={`wd-stepper__item wd-stepper__item--${state}`} type="button" onClick={() => onStepChange(item.id)}>
              <span className="wd-stepper__marker">{state === "complete" ? "✓" : index + 1}</span>
              <span><strong>{item.title}</strong><small>{item.description}</small></span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function CompanyInfoStep({ draft, onChange }: { draft: JobDraft; onChange: (field: keyof JobDraft, value: string) => void }) {
  return (
    <FormCard eyebrow="1단계" title="회사 기본 정보">
      <div className="wd-form-grid">
        <TextField label="회사명" placeholder="예: 유엑스디자인(주)" value={draft.companyName} onChange={(value) => onChange("companyName", value)} />
        <TextField label="회사 위치" placeholder="예: 서울 강남구 테헤란로, 삼성역 도보 7분" value={draft.address} onChange={(value) => onChange("address", value)} />
        <TextField label="담당자 이름" placeholder="예: 김원더" value={draft.contactName} onChange={(value) => onChange("contactName", value)} />
        <TextField label="담당자 연락처" placeholder="예: 010-1234-5678" value={draft.contactPhone} onChange={(value) => onChange("contactPhone", value)} />
        <TextField label="담당자 이메일" type="email" placeholder="예: recruit@uxdesign.example" value={draft.contactEmail} onChange={(value) => onChange("contactEmail", value)} />
      </div>
    </FormCard>
  );
}

function FlexibleWorkStep({ draft, onChange }: { draft: JobDraft; onChange: (field: keyof JobDraft, value: string) => void }) {
  return (
    <FormCard eyebrow="2단계" title="유연근무 조건">
      <div className="wd-form-grid">
        <SelectField label="재택/출근 방식" value={draft.workType} options={workTypeOptions} onChange={(value) => onChange("workType", value)} />
        <SelectField label="유연근무 유형" value={draft.flexibleWorkType} options={flexibleWorkTypeOptions} onChange={(value) => onChange("flexibleWorkType", value)} />
        <SelectField label="근무요일" value={draft.workDays} options={workDaysOptions} onChange={(value) => onChange("workDays", value)} />
        <SelectField label="일 근무 시간" value={draft.dailyWorkHours} options={dailyWorkHourOptions} onChange={(value) => onChange("dailyWorkHours", value)} />
        <div className="wd-time-pair">
          <SelectField label="근무 시작" value={draft.workStartTime} options={timeOptions} onChange={(value) => onChange("workStartTime", value)} />
          <SelectField label="근무 종료" value={draft.workEndTime} options={timeOptions} onChange={(value) => onChange("workEndTime", value)} />
        </div>
        <TextField label="보수" placeholder="예: 연봉 4,500만원 ~ 5,800만원" value={draft.salaryText} onChange={(value) => onChange("salaryText", value)} />
      </div>
      <p className="wd-caption wd-caption--left">분 단위는 00분, 30분만 선택할 수 있습니다. 시작 시간을 고르면 일 근무 시간 기준으로 종료 시간이 자동 입력되며, 직접 수정할 수 있습니다.</p>
    </FormCard>
  );
}

function WorkDetailStep({ draft, onChange }: { draft: JobDraft; onChange: (field: keyof JobDraft, value: string) => void }) {
  return (
    <FormCard eyebrow="3단계" title="업무 상세">
      <div className="wd-form-grid">
        <TextField label="공고 제목" placeholder="예: 서비스 디자이너 (Flexible Work)" value={draft.title} onChange={(value) => onChange("title", value)} />
        <SelectWithCustom label="직군" value={draft.occupation} customValue={draft.customOccupation} options={occupationOptions} placeholder="예: UI/UX디자인" onChange={(value) => onChange("occupation", value)} onCustomChange={(value) => onChange("customOccupation", value)} />
        <SelectField label="사업군" value={draft.businessField} options={businessFieldOptions} onChange={(value) => onChange("businessField", value)} />
        <SelectWithCustom label="직무명" value={draft.jobTitle} customValue={draft.customJobTitle} options={jobTitleOptions} placeholder="예: 서비스 디자이너" onChange={(value) => onChange("jobTitle", value)} onCustomChange={(value) => onChange("customJobTitle", value)} />
        <SelectField label="숙련도(연차)" value={draft.seniority} options={seniorityOptions} onChange={(value) => onChange("seniority", value)} />
        <TextField label="필요한 역량" placeholder="예: Figma, Sketch, FigJam 등 디자인 툴 활용 능숙자" value={draft.requiredSkillsText} onChange={(value) => onChange("requiredSkillsText", value)} />
        <TextAreaField label="주요 업무" placeholder={"예:\n사용자 중심의 서비스 경험 설계 및 UI/UX 디자인\n서비스 요구사항 분석 및 와이어프레임, 프로토타입 제작\n사용자 리서치 기반 인사이트 도출 및 개선안 제안"} value={draft.mainTasks} onChange={(value) => onChange("mainTasks", value)} />
        <TextAreaField label="우대 사항" placeholder={"예:\nSaaS, 플랫폼 서비스 디자인 경험\n데이터 분석 및 인사이트 기반 UX 개선 경험\n프로토타이핑 및 인터랙션 디자인 경험"} value={draft.preferredQualifications} onChange={(value) => onChange("preferredQualifications", value)} />
      </div>
    </FormCard>
  );
}

function AssignmentStep({
  assignmentChoice,
  filters,
  filteredAssignments,
  selectedAssignmentId,
  onAssignmentChoiceChange,
  onExistingAssignmentChange,
  onFilterChange
}: {
  assignmentChoice: AssignmentChoice;
  filters: AssignmentFilters;
  filteredAssignments: Assignment[];
  selectedAssignmentId: string;
  onAssignmentChoiceChange: (choice: AssignmentChoice) => void;
  onExistingAssignmentChange: (assignmentId: string) => void;
  onFilterChange: (field: keyof AssignmentFilters, value: string) => void;
}) {
  return (
    <FormCard eyebrow="4단계" title="과제 연결">
      <div className="wd-assignment-hero">
        <div>
          <strong>새 과제는 전용 생성 페이지에서 만들 수 있어요.</strong>
          <span>공고 등록 화면에서는 새 과제 생성 페이지로 이동하거나, 기존 과제를 검색해 연결합니다.</span>
        </div>
        <a className="wd-button wd-button--primary" href="/company/assignments/new?jobPostingId=draft">
          새 과제 생성하기
        </a>
      </div>
      <div className="wd-segmented" role="group" aria-label="과제 연결 방식">
        <button className={`wd-segmented__button ${assignmentChoice === "new" ? "is-active" : ""}`} type="button" onClick={() => onAssignmentChoiceChange("new")}>
          새 과제 생성
        </button>
        <button className={`wd-segmented__button ${assignmentChoice === "existing" ? "is-active" : ""}`} type="button" onClick={() => onAssignmentChoiceChange("existing")}>
          기존 과제에서 선택
        </button>
      </div>

      {assignmentChoice === "new" ? (
        <div className="wd-empty-state">
          <h3>새 과제 생성 페이지로 이동합니다</h3>
          <p>과제 생성 화면은 별도 담당자가 구현합니다. 이 화면에서는 연결 버튼만 준비해두었습니다.</p>
        </div>
      ) : (
        <ExistingAssignmentSearch
          filters={filters}
          filteredAssignments={filteredAssignments}
          selectedAssignmentId={selectedAssignmentId}
          onExistingAssignmentChange={onExistingAssignmentChange}
          onFilterChange={onFilterChange}
        />
      )}
    </FormCard>
  );
}

function ExistingAssignmentSearch({
  filters,
  filteredAssignments,
  selectedAssignmentId,
  onExistingAssignmentChange,
  onFilterChange
}: {
  filters: AssignmentFilters;
  filteredAssignments: Assignment[];
  selectedAssignmentId: string;
  onExistingAssignmentChange: (assignmentId: string) => void;
  onFilterChange: (field: keyof AssignmentFilters, value: string) => void;
}) {
  return (
    <div className="wd-assignment-search">
      <label className="wd-search-field">
        <span>직군, 사업군, 숙련도에 따른 사전 과제 검색</span>
        <input placeholder="예: Figma, 서비스 개선, 리디자인" value={filters.keyword} onChange={(event) => onFilterChange("keyword", event.target.value)} />
      </label>
      <div className="wd-filter-row">
        <SelectField label="직군" value={filters.occupation} options={["", ...occupationOptions.filter((item) => item !== "직접입력")]} onChange={(value) => onFilterChange("occupation", value)} />
        <SelectField label="사업군" value={filters.businessField} options={["", ...businessFieldOptions]} onChange={(value) => onFilterChange("businessField", value)} />
        <SelectField label="숙련도(연차)" value={filters.seniority} options={["", ...seniorityOptions]} onChange={(value) => onFilterChange("seniority", value)} />
      </div>
      <div className="wd-assignment-table-card">
        <div className="wd-assignment-table-head">
          <strong>{filteredAssignments.length} 문제</strong>
          <span>내 과제 우선 · 최신순</span>
        </div>
        <div className="wd-assignment-table" role="table" aria-label="기존 과제 목록">
          <div className="wd-assignment-table__row wd-assignment-table__row--head" role="row">
            <span>출처</span>
            <span>직군</span>
            <span>사업군</span>
            <span>숙련도(연차)</span>
            <span>제목</span>
            <span>채택</span>
            <span>시간</span>
            <span>선택</span>
          </div>
          {filteredAssignments.map((assignment) => (
            <div className="wd-assignment-table__row" role="row" key={assignment.assignmentId}>
              <span><OwnerBadge owner={assignment.owner} /> {assignment.companyName}</span>
              <span>{assignment.occupation}</span>
              <span>{assignment.businessField}</span>
              <span>{assignment.seniority}</span>
              <strong>{assignment.title}</strong>
              <span>{assignment.adoptionCount}회</span>
              <span>{assignment.estimatedHours}</span>
              <button className={`wd-table-select ${selectedAssignmentId === assignment.assignmentId ? "is-selected" : ""}`} type="button" onClick={() => onExistingAssignmentChange(assignment.assignmentId)}>
                {selectedAssignmentId === assignment.assignmentId ? "선택됨" : "선택"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="wd-card wd-form-card" aria-labelledby={`${title}-title`}>
      <div className="wd-section-heading">
        <div>
          <p className="wd-eyebrow">{eyebrow}</p>
          <h2 className="wd-section-title" id={`${title}-title`}>{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function TextField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="wd-field">
      <span>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  const hasAllOption = options.includes("");
  return (
    <label className="wd-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {!hasAllOption ? <option value="">{label} 선택</option> : null}
        {options.map((option) => (
          <option key={option || "all"} value={option}>{option || "전체"}</option>
        ))}
      </select>
    </label>
  );
}

function SelectWithCustom({
  label,
  value,
  customValue,
  options,
  placeholder,
  onChange,
  onCustomChange
}: {
  label: string;
  value: string;
  customValue: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  onCustomChange: (value: string) => void;
}) {
  return (
    <div className="wd-field">
      <label>
        <span>{label}</span>
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">{label} 선택</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
      {value === "직접입력" ? (
        <input value={customValue} placeholder={placeholder} onChange={(event) => onCustomChange(event.target.value)} />
      ) : null}
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="wd-field wd-field--wide">
      <span>{label}</span>
      <textarea rows={5} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function FooterActions({ canMoveNext, canMovePrevious, hasAssignment, onComplete, onFullPreview, onMoveNext, onMovePrevious }: { canMoveNext: boolean; canMovePrevious: boolean; hasAssignment: boolean; onComplete: () => void; onFullPreview: () => void; onMoveNext: () => void; onMovePrevious: () => void }) {
  return (
    <div className="wd-form-footer">
      <button className="wd-button wd-button--secondary" disabled={!canMovePrevious} type="button" onClick={onMovePrevious}>이전</button>
      <div className="wd-form-footer__right">
        <button className="wd-button wd-button--secondary" type="button" onClick={onFullPreview}>미리보기</button>
        {canMoveNext ? (
          <button className="wd-button wd-button--primary" type="button" onClick={onMoveNext}>다음 단계</button>
        ) : (
          <button className="wd-button wd-button--primary" type="button" onClick={onComplete}>등록 완료</button>
        )}
      </div>
      <p className="wd-caption">{hasAssignment ? "선택한 기존 과제가 공고와 함께 연결됩니다." : "새 과제 생성 페이지로 이동하거나 기존 과제를 선택할 수 있습니다."}</p>
    </div>
  );
}

function JobPostPreviewPanel({ jobDraft, assignment }: { jobDraft: JobDraft; assignment: Assignment | null }) {
  return (
    <aside className="wd-preview-panel" aria-labelledby="preview-title">
      <PreviewHeader title={jobDraft.title} compact />
      <PreviewContent assignment={assignment} jobDraft={jobDraft} />
    </aside>
  );
}

function FullJobPostPreview({ jobDraft, assignment, onBack, onComplete }: { jobDraft: JobDraft; assignment: Assignment | null; onBack: () => void; onComplete: () => void }) {
  return (
    <main className="wd-container wd-full-preview-page">
      <div className="wd-full-preview-toolbar">
        <button className="wd-button wd-button--secondary" type="button" onClick={onBack}>작성 화면으로 돌아가기</button>
        <button className="wd-button wd-button--primary" type="button" onClick={onComplete}>등록 완료</button>
      </div>
      <article className="wd-panel wd-full-preview">
        <PreviewHeader title={jobDraft.title} />
        <PreviewContent assignment={assignment} jobDraft={jobDraft} full />
      </article>
    </main>
  );
}

function PreviewHeader({ title, compact = false }: { title: string; compact?: boolean }) {
  return (
    <>
      <div className="wd-preview-panel__header">
        <div>
          <p className="wd-eyebrow">{compact ? "실시간 미리보기" : "공고 미리보기"}</p>
          <h2 className="wd-section-title" id="preview-title">{title || "서비스 디자이너 (Flexible Work)"}</h2>
        </div>
        <span className="wd-badge wd-badge--draft">임시 저장</span>
      </div>
      <div className="wd-preview-warning">등록 완료 전까지 지원자에게 공개되지 않습니다.</div>
    </>
  );
}

function PreviewContent({ jobDraft, assignment, full = false }: { jobDraft: JobDraft; assignment: Assignment | null; full?: boolean }) {
  const skills = splitList(jobDraft.requiredSkillsText);
  const mainTasks = jobDraft.mainTasks.split("\n").map((item) => item.trim()).filter(Boolean);
  const preferred = jobDraft.preferredQualifications.split("\n").map((item) => item.trim()).filter(Boolean);

  return (
    <div className={full ? "wd-preview-content wd-preview-content--full" : "wd-preview-content"}>
      <PreviewSection title="회사 정보">
        <PreviewRow label="회사명" value={jobDraft.companyName} fallback="유엑스디자인(주)" />
        <PreviewRow label="위치" value={jobDraft.address} fallback="서울 강남구 테헤란로, 삼성역 도보 7분" />
        <PreviewRow label="담당자" value={jobDraft.contactName} fallback="김원더" />
        <PreviewRow label="연락처" value={jobDraft.contactPhone || jobDraft.contactEmail} fallback="recruit@uxdesign.example" />
      </PreviewSection>
      <PreviewSection title="유연근무 조건">
        <div className="wd-chip-row">
          {[jobDraft.flexibleWorkType, jobDraft.workType, jobDraft.workDays].filter(Boolean).map((item) => (
            <span className="wd-chip" key={item}>{item}</span>
          ))}
        </div>
        <PreviewRow label="근무 시간" value={`${jobDraft.dailyWorkHours || "일 4시간"} · ${jobDraft.workStartTime || "10:00"} - ${jobDraft.workEndTime || "15:00"}`} />
        <PreviewRow label="보수" value={jobDraft.salaryText} fallback="연봉 4,500만원 ~ 5,800만원" />
      </PreviewSection>
      <PreviewSection title="업무 상세">
        <PreviewRow label="직군" value={jobDraft.occupation} fallback="UI/UX디자인" />
        <PreviewRow label="직무" value={jobDraft.jobTitle} fallback="서비스 디자이너" />
        <PreviewRow label="숙련도" value={jobDraft.seniority} fallback="주니어(3~5년차)" />
        <div className="wd-chip-row">
          {(skills.length ? skills : ["Figma", "Sketch", "FigJam"]).map((skill) => (
            <span className="wd-chip wd-chip--soft" key={skill}>{skill}</span>
          ))}
        </div>
        <ul className="wd-preview-list">
          {(mainTasks.length ? mainTasks : ["사용자 중심의 서비스 경험 설계 및 UI/UX 디자인", "서비스 요구사항 분석 및 와이어프레임, 프로토타입 제작", "사용자 리서치 기반 인사이트 도출 및 개선안 제안"]).map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ul>
      </PreviewSection>
      <PreviewSection title="우대 사항">
        <ul className="wd-preview-list">
          {(preferred.length ? preferred : ["SaaS, 플랫폼 서비스 디자인 경험", "데이터 분석 및 인사이트 기반 UX 개선 경험", "프로토타이핑 및 인터랙션 디자인 경험"]).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </PreviewSection>
      <PreviewSection title="사전과제">
        {assignment ? (
          <div className="wd-linked-assignment">
            <div className="wd-assignment-source-line"><OwnerBadge owner={assignment.owner} /><StatusBadge status={assignment.status} /></div>
            <h3>{assignment.title}</h3>
            <p>{assignment.summary}</p>
            <div className="wd-chip-row">
              <span className="wd-chip">{assignment.estimatedHours}</span>
              {assignment.evaluationItems.map((item) => <span className="wd-chip wd-chip--soft" key={item}>{item}</span>)}
            </div>
          </div>
        ) : (
          <div className="wd-empty-inline">기존 과제를 선택하거나 새 과제 생성 페이지로 이동할 수 있습니다.</div>
        )}
      </PreviewSection>
    </div>
  );
}

function PreviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="wd-preview-section">
      <div className="wd-preview-section__title">
        <h3>{title}</h3>
        <button className="wd-ghost-button" type="button">수정</button>
      </div>
      {children}
    </section>
  );
}

function PreviewRow({ label, value, fallback }: { label: string; value: string; fallback?: string }) {
  return (
    <div className="wd-preview-row">
      <span>{label}</span>
      <strong className={value ? "" : "is-placeholder"}>{value || fallback || "입력 전"}</strong>
    </div>
  );
}

function StatusBadge({ status }: { status: AssignmentStatus }) {
  const labelByStatus: Record<AssignmentStatus, string> = {
    available: "사용 가능",
    linked: "공고 연결됨",
    draft: "임시 저장"
  };
  return <span className={`wd-badge wd-badge--${status}`}>{labelByStatus[status]}</span>;
}

function OwnerBadge({ owner }: { owner: AssignmentOwner }) {
  return <span className={`wd-owner-badge wd-owner-badge--${owner}`}>{owner === "mine" ? "내 과제" : "공개 과제"}</span>;
}
