import { useMemo, useState, type ReactNode } from "react";

import { CompanyHeaderNav } from "../../components/company/CompanyHeaderNav";

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
  isCareerRequired: boolean;
  isExperienceIrrelevant: boolean;
  experienceMin: string;
  experienceMax: string;
  education: string;
  additionalSections: string[];
  requiredSkillsText: string;
  mainTasks: string;
  preferredQualifications: string;
  employmentType: string;
  probationPeriod: string;
  salaryText: string;
  salaryAmount: string;
  applicationDeadlineType: string;
  applicationStartDate: string;
  applicationStartTime: string;
  applicationEndDate: string;
  applicationEndTime: string;
  applicationDuration: string;
  hiringProcess: string[];
  workType: string;
  flexibleWorkTypes: string[];
  workDays: string[];
  dailyWorkHours: string;
  workStartTime: string;
  workEndTime: string;
};

type AssignmentFilters = {
  occupation: string;
  businessField: string;
  seniority: string;
  keyword: string;
};

type JobDraftChange = <K extends keyof JobDraft>(field: K, value: JobDraft[K]) => void;

const stepMeta: Array<{ id: CreateStep; title: string; description: string }> = [
  { id: "company", title: "회사 기본 정보", description: "회사명, 담당자 정보" },
  { id: "flexible-work", title: "유연근무 조건", description: "근무 방식, 요일, 시간" },
  { id: "work-detail", title: "업무 상세", description: "직무, 경력, 고용형태" },
  { id: "assignment", title: "과제 연결", description: "기존 과제 검색 또는 새 과제 생성" }
];

const occupationOptions = ["UI/UX디자인", "프로덕트 디자인", "웹디자인", "프론트엔드 개발", "서비스 운영", "직접입력"];
const businessFieldOptions = ["IT 서비스", "플랫폼", "이커머스", "라이프스타일", "교육"];
const jobTitleOptions = ["UI/UX 디자이너", "프로덕트 디자이너", "UX 리서처", "UI 디자이너", "CX 매니저", "프론트엔드 개발자"];
const seniorityOptions = ["주니어(1~3년차)", "주니어(3~5년차)", "미드 레벨(5~10년차)", "시니어(10~15년차)", "경력 무관"];
const experienceMinOptions = Array.from({ length: 20 }, (_, index) => `${index + 1}년 이상`);
const experienceMaxOptions = Array.from({ length: 20 }, (_, index) => `${index + 1}년 이하`);
const educationOptions = ["학력무관", "고졸 이상", "초대졸 이상", "대졸 이상", "석사 이상"];
const employmentTypeOptions = ["정규직", "계약직"];
const probationPeriodOptions = ["수습기간 없음", "1개월", "2개월", "3개월", "6개월"];
const salaryOptions = ["면접 후 결정", "회사 내규에 따름", "연봉 입력"];
const applicationDeadlineOptions = ["마감일 지정", "채용 시 마감", "상시 채용"];
const applicationHourOptions = Array.from({ length: 25 }, (_, index) => `${index}시`);
const applicationDurationOptions = ["1개월", "2개월"];
const workTypeOptions = ["100% 원격근무", "원격근무 중심", "출근중심"];
const flexibleWorkTypeOptions = [
  {
    value: "원격근무",
    description: "정해진 근무지 출근 없이 집이나 원하는 장소에서 일할 수 있어요."
  },
  {
    value: "시차 출퇴근",
    description: "출근과 퇴근 시간을 정해진 범위 안에서 조정할 수 있어요."
  },
  {
    value: "시간 선택",
    description: "하루 근무 시간을 유지하되 일하는 시간대를 협의할 수 있어요."
  },
  {
    value: "단축 근무",
    description: "일 4~6시간처럼 일반 풀타임보다 짧은 시간으로 일해요."
  }
];
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
    seniority: "주니어(1~3년차)",
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
    occupation: "서비스 운영",
    businessField: "교육",
    seniority: "경력 무관",
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
    businessField: "라이프스타일",
    seniority: "시니어(10~15년차)",
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
  isCareerRequired: false,
  isExperienceIrrelevant: false,
  experienceMin: "",
  experienceMax: "",
  education: "",
  additionalSections: [],
  requiredSkillsText: "",
  mainTasks: "",
  preferredQualifications: "",
  employmentType: "",
  probationPeriod: "",
  salaryText: "",
  salaryAmount: "",
  applicationDeadlineType: "",
  applicationStartDate: "2026-07-08",
  applicationStartTime: "13시",
  applicationEndDate: "",
  applicationEndTime: "",
  applicationDuration: "",
  hiringProcess: ["서류전형", "1차면접", "2차면접", "최종합격"],
  workType: "",
  flexibleWorkTypes: [],
  workDays: [],
  dailyWorkHours: "",
  workStartTime: "",
  workEndTime: ""
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

function toggleArrayValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function getExperienceRange(min: string, max: string, isExperienceIrrelevant = false) {
  if (isExperienceIrrelevant) return "경력 무관";
  if (min && max) return `${min} 이상 ~ ${max} 이하`;
  if (min) return `${min} 이상`;
  if (max) return `${max} 이하`;
  return "";
}

function getEmploymentText(employmentType: string, probationPeriod: string) {
  if (!employmentType) return "";
  if (employmentType === "정규직" && probationPeriod) return `${employmentType} · ${probationPeriod}`;
  return employmentType;
}

function getSalaryText(salaryText: string, salaryAmount: string) {
  if (salaryText === "연봉 입력" && salaryAmount) return `${salaryText} · ${salaryAmount}`;
  return salaryText;
}

function getApplicationPeriodText(draft: JobDraft) {
  const start = [draft.applicationStartDate, draft.applicationStartTime].filter(Boolean).join(" ");
  const end = [draft.applicationEndDate, draft.applicationEndTime].filter(Boolean).join(" ");
  const range = start || end ? `${start || "시작일 미정"} ~ ${end || "마감일 미정"}` : "";
  return [draft.applicationDeadlineType, range, draft.applicationDuration].filter(Boolean).join(" · ");
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

  const updateJobDraft = <K extends keyof JobDraft>(field: K, value: JobDraft[K]) => {
    setJobDraft((current) => {
      const next = { ...current, [field]: value };
      if (field === "workStartTime" || field === "dailyWorkHours") {
        next.workEndTime = addWorkHoursWithLunch(
          field === "workStartTime" ? String(value) : current.workStartTime,
          field === "dailyWorkHours" ? String(value) : current.dailyWorkHours
        );
      }
      if (field === "occupation") setFilters((currentFilters) => ({ ...currentFilters, occupation: String(value) }));
      if (field === "businessField") setFilters((currentFilters) => ({ ...currentFilters, businessField: String(value) }));
      if (field === "seniority") setFilters((currentFilters) => ({ ...currentFilters, seniority: String(value) }));
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

  const completeRegistration = () => {
    window.history.pushState(null, "", completePath);
    window.dispatchEvent(new Event("wd:navigate"));
  };

  const editPreviewStep = (nextStep: CreateStep) => {
    setIsFullPreviewOpen(false);
    goToStep(nextStep);
  };

  const previewJob = {
    ...jobDraft,
    occupation: resolvedOccupation,
    jobTitle: resolvedJobTitle
  };

  if (isFullPreviewOpen) {
    return (
      <div className="wd-company-page">
        <CompanyHeaderNav activePath="/company/job-posts" />
        <FullJobPostPreview
          assignment={selectedAssignment}
          jobDraft={previewJob}
          onBack={() => setIsFullPreviewOpen(false)}
          onComplete={completeRegistration}
          onEditStep={editPreviewStep}
        />
      </div>
    );
  }

  return (
    <div className="wd-company-page">
      <CompanyHeaderNav activePath="/company/job-posts" />
      <main className="wd-container wd-create-page">
      <div className="wd-page-heading">
        <div>
          <h1 className="wd-page-title">새 공고 등록하기</h1>
          <p className="wd-lead">공고관리에서 새 공고 등록하기를 눌렀을 때 이어지는 등록 화면입니다.</p>
        </div>
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
            onComplete={completeRegistration}
            onFullPreview={() => setIsFullPreviewOpen(true)}
            onMoveNext={() => moveStep(1)}
            onMovePrevious={() => moveStep(-1)}
          />
        </section>
        <JobPostPreviewPanel assignment={selectedAssignment} jobDraft={previewJob} onEditStep={editPreviewStep} />
      </div>
      </main>
    </div>
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

function CompanyInfoStep({ draft, onChange }: { draft: JobDraft; onChange: JobDraftChange }) {
  return (
    <FormCard eyebrow="1단계" title="회사 기본 정보">
      <div className="wd-form-grid">
        <TextField label="회사명" placeholder="예: 원더독스" value={draft.companyName} onChange={(value) => onChange("companyName", value)} />
        <TextField label="담당자 이름" placeholder="예: 김원더" value={draft.contactName} onChange={(value) => onChange("contactName", value)} />
        <TextField label="담당자 연락처" placeholder="예: 010-1234-5678" value={draft.contactPhone} onChange={(value) => onChange("contactPhone", value)} />
        <TextField label="담당자 이메일" type="email" placeholder="예: recruit@uxdesign.example" value={draft.contactEmail} onChange={(value) => onChange("contactEmail", value)} />
      </div>
    </FormCard>
  );
}

function FlexibleWorkStep({ draft, onChange }: { draft: JobDraft; onChange: JobDraftChange }) {
  const [openHelpType, setOpenHelpType] = useState<string | null>(null);

  const updateMultiSelect = (field: "flexibleWorkTypes" | "workDays", value: string) => {
    onChange(field, toggleArrayValue(draft[field], value));
  };

  return (
    <FormCard eyebrow="2단계" title="유연근무 조건">
      <div className="wd-flex-work-stack">
        <section className="wd-work-location" aria-labelledby="work-location-title">
          <div className="wd-field wd-field--wide">
            <span id="work-location-title">근무지 주소</span>
            <div className="wd-address-row">
              <input value={draft.address} placeholder="예: 서울 강남구 테헤란로, 삼성역 도보 7분" onChange={(event) => onChange("address", event.target.value)} />
              <button className="wd-button wd-button--secondary wd-button--compact" type="button">변경</button>
            </div>
          </div>
          <div className="wd-work-mode-options" role="group" aria-label="근무지 출근 방식">
            {workTypeOptions.map((option) => (
              <CheckPill key={option} label={option} selected={draft.workType === option} onClick={() => onChange("workType", option)} />
            ))}
          </div>
        </section>

        <section className="wd-flex-section" aria-labelledby="flexible-work-type-title">
          <div className="wd-flex-section__head">
            <h3 id="flexible-work-type-title">유연근무 유형</h3>
          </div>
          <div className="wd-option-card-grid">
            {flexibleWorkTypeOptions.map((option) => (
              <div
                className={`wd-option-card ${draft.flexibleWorkTypes.includes(option.value) ? "is-selected" : ""}`}
                key={option.value}
              >
                <button className="wd-option-card__select" type="button" onClick={() => updateMultiSelect("flexibleWorkTypes", option.value)}>
                  <span className="wd-option-card__label">{option.value}</span>
                </button>
                <button
                  className="wd-help-dot"
                  type="button"
                  aria-label={`${option.value} 설명 보기`}
                  aria-expanded={openHelpType === option.value}
                  onClick={() => setOpenHelpType((current) => (current === option.value ? null : option.value))}
                >
                  ?
                </button>
                {openHelpType === option.value ? (
                  <div className="wd-help-tooltip" role="tooltip">
                    {option.description}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="wd-flex-section" aria-labelledby="work-days-title">
          <div className="wd-flex-section__head">
            <h3 id="work-days-title">근무요일</h3>
          </div>
          <div className="wd-day-toggle-grid" role="group" aria-label="근무요일 중복 선택">
            {workDaysOptions.map((option) => (
              <CheckPill key={option} label={option} selected={draft.workDays.includes(option)} onClick={() => updateMultiSelect("workDays", option)} />
            ))}
          </div>
        </section>

        <section className="wd-work-time-card" aria-labelledby="work-time-title">
          <div className="wd-flex-section__head">
            <h3 id="work-time-title">근무시간</h3>
            <span>{draft.workStartTime && draft.workEndTime ? `${draft.workStartTime} - ${draft.workEndTime}` : "시작 시간을 고르면 종료 시간이 자동 계산돼요"}</span>
          </div>
          <div className="wd-form-grid">
            <SelectField label="일 근무 시간" value={draft.dailyWorkHours} options={dailyWorkHourOptions} onChange={(value) => onChange("dailyWorkHours", value)} />
            <div className="wd-time-pair">
              <SelectField label="근무 시작" value={draft.workStartTime} options={timeOptions} onChange={(value) => onChange("workStartTime", value)} />
              <SelectField label="근무 종료" value={draft.workEndTime} options={timeOptions} onChange={(value) => onChange("workEndTime", value)} />
            </div>
          </div>
        </section>
      </div>
    </FormCard>
  );
}

function WorkDetailStep({ draft, onChange }: { draft: JobDraft; onChange: JobDraftChange }) {
  const toggleAdditionalSection = (section: string) => {
    onChange("additionalSections", toggleArrayValue(draft.additionalSections, section));
  };

  const updateHiringProcess = (index: number, value: string) => {
    onChange("hiringProcess", draft.hiringProcess.map((step, stepIndex) => (stepIndex === index ? value : step)));
  };

  const addHiringProcess = () => {
    onChange("hiringProcess", [...draft.hiringProcess, "추가절차"]);
  };

  const removeHiringProcess = (index: number) => {
    onChange("hiringProcess", draft.hiringProcess.filter((_, stepIndex) => stepIndex !== index));
  };

  return (
    <FormCard eyebrow="3단계" title="업무 상세">
      <div className="wd-form-grid">
        <TextField label="공고 제목" placeholder="예: UI/UX 디자이너" value={draft.title} onChange={(value) => onChange("title", value)} />
        <SelectField label="직무" value={draft.jobTitle} options={jobTitleOptions} onChange={(value) => onChange("jobTitle", value)} />

        <div className="wd-field wd-field--wide">
          <span>경력</span>
          <div className="wd-career-row">
            <CheckPill label="경력" selected={draft.isCareerRequired} onClick={() => onChange("isCareerRequired", !draft.isCareerRequired)} />
            <CheckPill label="경력 무관" selected={draft.isExperienceIrrelevant} onClick={() => onChange("isExperienceIrrelevant", !draft.isExperienceIrrelevant)} />
            <InlineSelect ariaLabel="최소 경력" value={draft.experienceMin} options={experienceMinOptions} placeholder="1년 이상" onChange={(value) => onChange("experienceMin", value)} />
            <span className="wd-range-divider">~</span>
            <InlineSelect ariaLabel="최대 경력" value={draft.experienceMax} options={experienceMaxOptions} placeholder="2년 이하" onChange={(value) => onChange("experienceMax", value)} />
          </div>
        </div>

        <SelectField label="학력" value={draft.education} options={educationOptions} onChange={(value) => onChange("education", value)} />
        <div className="wd-field wd-field--wide">
          <span>급여</span>
          <div className="wd-salary-row">
            <InlineSelect ariaLabel="급여" value={draft.salaryText} options={salaryOptions} placeholder="면접 후 결정" onChange={(value) => onChange("salaryText", value)} />
            {draft.salaryText === "연봉 입력" ? (
              <input value={draft.salaryAmount} placeholder="예: 연봉 5,000만원" onChange={(event) => onChange("salaryAmount", event.target.value)} />
            ) : null}
          </div>
          <div className="wd-min-wage-notice">
            <strong>ⓘ 2026년 기준 최저시급 10,030원</strong>
            <span>당사는 최저임금을 준수하며, 최저임금 미만의 공고는 강제 마감 및 행정 처분을 받을 수 있습니다.</span>
            <a href="#" aria-label="최저임금제도 안내">최저임금제도 안내</a>
          </div>
        </div>

        <div className="wd-field wd-field--wide">
          <span>고용형태</span>
          <div className="wd-employment-row" role="group" aria-label="고용형태 선택">
            {employmentTypeOptions.map((option) => (
              <CheckPill key={option} label={option} selected={draft.employmentType === option} onClick={() => onChange("employmentType", option)} />
            ))}
          </div>
          {draft.employmentType === "정규직" ? (
            <div className="wd-probation-box">
              <SelectField label="수습기간" value={draft.probationPeriod} options={probationPeriodOptions} onChange={(value) => onChange("probationPeriod", value)} />
            </div>
          ) : null}
        </div>

        <div className="wd-field wd-field--wide">
          <span>추가항목</span>
          <div className="wd-additional-row">
            {["자격요건", "우대사항"].map((section) => (
              <button className={`wd-add-button ${draft.additionalSections.includes(section) ? "is-active" : ""}`} key={section} type="button" onClick={() => toggleAdditionalSection(section)}>
                {draft.additionalSections.includes(section) ? "−" : "+"} {section}
              </button>
            ))}
          </div>
        </div>
        {draft.additionalSections.includes("자격요건") ? (
          <TextAreaField label="자격요건" placeholder={"예:\nFigma 등 디자인 툴 활용이 능숙한 분\n서비스 UX 설계 경험이 있는 분"} value={draft.requiredSkillsText} onChange={(value) => onChange("requiredSkillsText", value)} />
        ) : null}
        {draft.additionalSections.includes("우대사항") ? (
          <TextAreaField label="우대사항" placeholder={"예:\nSaaS, 플랫폼 서비스 디자인 경험\n데이터 분석 기반 UX 개선 경험"} value={draft.preferredQualifications} onChange={(value) => onChange("preferredQualifications", value)} />
        ) : null}

        <div className="wd-field wd-field--wide">
          <span>접수기간</span>
          <div className="wd-application-period">
            <InlineSelect ariaLabel="접수 마감 방식" value={draft.applicationDeadlineType} options={applicationDeadlineOptions} placeholder="마감일 지정" onChange={(value) => onChange("applicationDeadlineType", value)} />
            <InlineDateField ariaLabel="시작일" value={draft.applicationStartDate} onChange={(value) => onChange("applicationStartDate", value)} />
            <InlineSelect ariaLabel="시작 시간" value={draft.applicationStartTime} options={applicationHourOptions} placeholder="13시" onChange={(value) => onChange("applicationStartTime", value)} />
            <span className="wd-range-divider">~</span>
            <InlineDateField ariaLabel="마감일" value={draft.applicationEndDate} onChange={(value) => onChange("applicationEndDate", value)} />
            <InlineSelect ariaLabel="마감 시간" value={draft.applicationEndTime} options={applicationHourOptions} placeholder="24시" onChange={(value) => onChange("applicationEndTime", value)} />
            <div className="wd-duration-row" role="group" aria-label="접수기간 빠른 선택">
              {applicationDurationOptions.map((option) => (
                <CheckPill key={option} label={option} selected={draft.applicationDuration === option} onClick={() => onChange("applicationDuration", option)} />
              ))}
            </div>
          </div>
        </div>

        <div className="wd-field wd-field--wide">
          <span>채용절차</span>
          <div className="wd-hiring-process">
            {draft.hiringProcess.map((step, index) => (
              <div className="wd-hiring-step" key={`${step}-${index}`}>
                <input value={step} onChange={(event) => updateHiringProcess(index, event.target.value)} />
                <button type="button" aria-label={`${step} 삭제`} onClick={() => removeHiringProcess(index)}>×</button>
              </div>
            ))}
            <button className="wd-hiring-add" type="button" aria-label="채용절차 추가" onClick={addHiringProcess}>+</button>
          </div>
        </div>
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
      <div className="wd-assignment-choice-tabs" role="group" aria-label="과제 연결 방식">
        <button className={`wd-assignment-choice-tabs__button ${assignmentChoice === "new" ? "is-active" : ""}`} type="button" onClick={() => onAssignmentChoiceChange("new")}>
          새 과제 생성하기
        </button>
        <button className={`wd-assignment-choice-tabs__button ${assignmentChoice === "existing" ? "is-active" : ""}`} type="button" onClick={() => onAssignmentChoiceChange("existing")}>
          기존 과제에서 선택
        </button>
      </div>

      {assignmentChoice === "new" ? (
        <section className="wd-new-assignment-panel" aria-labelledby="new-assignment-title">
          <p>공고 업무에 딱 맞는 사전 과제를 생성하고<br />지원자들의 진짜 실력을 확인하세요</p>
          <a id="new-assignment-title" className="wd-new-assignment-panel__cta" href="/company/assignments">
            새 과제 생성하기
          </a>
        </section>
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
      <div className="wd-filter-row">
        <SelectField label="직무" value={filters.occupation} options={["", ...occupationOptions.filter((item) => item !== "직접입력")]} onChange={(value) => onFilterChange("occupation", value)} />
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
            <span>직무</span>
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
        <div className="wd-assignment-table-footer">
          <a className="wd-assignment-more-link" href="/company/assignments">과제 더 보기</a>
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

function CheckPill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button className={`wd-check-pill ${selected ? "is-selected" : ""}`} type="button" aria-pressed={selected} onClick={onClick}>
      <span className="wd-check-pill__box" aria-hidden="true" />
      {label}
    </button>
  );
}

function InlineSelect({ ariaLabel, value, onChange, options, placeholder }: { ariaLabel: string; value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) {
  return (
    <select className="wd-inline-control" aria-label={ariaLabel} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}

function InlineDateField({ ariaLabel, value, onChange }: { ariaLabel: string; value: string; onChange: (value: string) => void }) {
  return <input className="wd-inline-control" aria-label={ariaLabel} type="date" value={value} onChange={(event) => onChange(event.target.value)} />;
}

function FooterActions({
  canMoveNext,
  canMovePrevious,
  hasAssignment,
  onComplete,
  onFullPreview,
  onMoveNext,
  onMovePrevious
}: {
  canMoveNext: boolean;
  canMovePrevious: boolean;
  hasAssignment: boolean;
  onComplete: () => void;
  onFullPreview: () => void;
  onMoveNext: () => void;
  onMovePrevious: () => void;
}) {
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
      {hasAssignment ? <p className="wd-caption">선택한 기존 과제가 공고와 함께 연결됩니다.</p> : null}
    </div>
  );
}

function JobPostPreviewPanel({
  jobDraft,
  assignment,
  onEditStep
}: {
  jobDraft: JobDraft;
  assignment: Assignment | null;
  onEditStep: (step: CreateStep) => void;
}) {
  return (
    <aside className="wd-preview-panel" aria-labelledby="preview-title">
      <PreviewHeader title={jobDraft.title} compact />
      <PreviewContent assignment={assignment} jobDraft={jobDraft} onEditStep={onEditStep} />
    </aside>
  );
}

function FullJobPostPreview({
  jobDraft,
  assignment,
  onBack,
  onComplete,
  onEditStep
}: {
  jobDraft: JobDraft;
  assignment: Assignment | null;
  onBack: () => void;
  onComplete: () => void;
  onEditStep: (step: CreateStep) => void;
}) {
  return (
    <main className="wd-container wd-full-preview-page">
      <div className="wd-full-preview-toolbar">
        <button className="wd-button wd-button--secondary" type="button" onClick={onBack}>작성 화면으로 돌아가기</button>
        <button className="wd-button wd-button--primary" type="button" onClick={onComplete}>등록 완료</button>
      </div>
      <article className="wd-panel wd-full-preview">
        <PreviewHeader title={jobDraft.title} />
        <PreviewContent assignment={assignment} jobDraft={jobDraft} full onEditStep={onEditStep} />
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
          <h2 className="wd-section-title" id="preview-title">{title || "UI/UX 디자이너"}</h2>
        </div>
        <span className="wd-badge wd-badge--draft">임시 저장</span>
      </div>
      <div className="wd-preview-warning">등록 완료 전까지 지원자에게 공개되지 않습니다.</div>
    </>
  );
}

function PreviewContent({
  jobDraft,
  assignment,
  full = false,
  onEditStep
}: {
  jobDraft: JobDraft;
  assignment: Assignment | null;
  full?: boolean;
  onEditStep: (step: CreateStep) => void;
}) {
  const requirements = splitList(jobDraft.requiredSkillsText);
  const preferred = jobDraft.preferredQualifications.split("\n").map((item) => item.trim()).filter(Boolean);
  const experienceText = getExperienceRange(jobDraft.experienceMin, jobDraft.experienceMax, jobDraft.isExperienceIrrelevant);
  const employmentText = getEmploymentText(jobDraft.employmentType, jobDraft.probationPeriod);
  const applicationPeriodText = getApplicationPeriodText(jobDraft);
  const salaryText = getSalaryText(jobDraft.salaryText, jobDraft.salaryAmount);

  return (
    <div className={full ? "wd-preview-content wd-preview-content--full" : "wd-preview-content"}>
      <PreviewSection title="회사 정보" onEdit={() => onEditStep("company")}>
        <PreviewRow label="회사명" value={jobDraft.companyName} fallback="원더독스" />
        <PreviewRow label="담당자" value={jobDraft.contactName} fallback="김원더" />
        <PreviewRow label="연락처" value={jobDraft.contactPhone || jobDraft.contactEmail} fallback="recruit@uxdesign.example" />
      </PreviewSection>
      <PreviewSection title="유연근무 조건" onEdit={() => onEditStep("flexible-work")}>
        <PreviewRow label="근무지" value={jobDraft.address} fallback="서울 강남구 테헤란로, 삼성역 도보 7분" />
        <div className="wd-chip-row">
          {[jobDraft.workType, ...jobDraft.flexibleWorkTypes, ...jobDraft.workDays].filter(Boolean).map((item) => (
            <span className="wd-chip" key={item}>{item}</span>
          ))}
        </div>
        <PreviewRow label="근무 시간" value={`${jobDraft.dailyWorkHours || "일 4시간"} · ${jobDraft.workStartTime || "10:00"} - ${jobDraft.workEndTime || "15:00"}`} />
      </PreviewSection>
      <PreviewSection title="업무 상세" onEdit={() => onEditStep("work-detail")}>
        <PreviewRow label="직무" value={jobDraft.jobTitle} fallback="UI/UX 디자이너" />
        <PreviewRow label="경력" value={experienceText} fallback="1년 이상 ~ 3년 이하" />
        <PreviewRow label="학력" value={jobDraft.education} fallback="학력무관" />
        <PreviewRow label="고용형태" value={employmentText} fallback="정규직 · 수습기간 3개월" />
        <PreviewRow label="급여" value={salaryText} fallback="면접 후 결정" />
        <PreviewRow label="접수기간" value={applicationPeriodText} fallback="마감일 지정 · 1개월" />
        <PreviewRow label="채용절차" value={jobDraft.hiringProcess.filter(Boolean).join(" > ")} fallback="서류전형 > 1차면접 > 최종합격" />
      </PreviewSection>
      {jobDraft.additionalSections.length ? (
        <PreviewSection title="추가항목" onEdit={() => onEditStep("work-detail")}>
          {jobDraft.additionalSections.includes("자격요건") ? (
            <>
              <strong className="wd-preview-subtitle">자격요건</strong>
              <ul className="wd-preview-list">
                {(requirements.length ? requirements : ["Figma 등 디자인 툴 활용이 능숙한 분", "서비스 UX 설계 경험이 있는 분"]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
          {jobDraft.additionalSections.includes("우대사항") ? (
            <>
              <strong className="wd-preview-subtitle">우대사항</strong>
              <ul className="wd-preview-list">
                {(preferred.length ? preferred : ["SaaS, 플랫폼 서비스 디자인 경험", "데이터 분석 기반 UX 개선 경험"]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
        </PreviewSection>
      ) : null}
      <PreviewSection title="사전과제" onEdit={() => onEditStep("assignment")}>
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

function PreviewSection({ title, children, onEdit }: { title: string; children: ReactNode; onEdit: () => void }) {
  return (
    <section className="wd-preview-section">
      <div className="wd-preview-section__title">
        <h3>{title}</h3>
        <button className="wd-ghost-button" type="button" onClick={onEdit}>수정</button>
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
