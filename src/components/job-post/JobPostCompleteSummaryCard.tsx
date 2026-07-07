import { Badge } from "../common/Badge";
import { Card } from "../common/Card";
import type { JobPosting } from "../../types/jobPosting";
import type { Company } from "../../types/company";

type JobPostCompleteSummaryCardProps = {
  company: Company;
  jobPosting: JobPosting;
};

const summaryItems = [
  { label: "경력", key: "experienceLevel", icon: "briefcase" },
  { label: "근무 형태", key: "workType", icon: "home" },
  { label: "고용 형태", key: "employmentType", icon: "building" },
  { label: "연봉", key: "salaryText", icon: "coin" },
  { label: "마감일", key: "deadline", icon: "calendar" },
  { label: "지원 현황", key: "applicants", icon: "user" }
] as const;

export function JobPostCompleteSummaryCard({
  company,
  jobPosting
}: JobPostCompleteSummaryCardProps) {
  const values = {
    experienceLevel: jobPosting.experienceLevel,
    workType: jobPosting.workType,
    employmentType: jobPosting.employmentType,
    salaryText: jobPosting.salaryText,
    deadline: "상시 채용",
    applicants: `${jobPosting.applicantCount ?? 0}명 지원`
  };

  return (
    <Card className="wd-complete-summary">
      <h2>등록된 공고 요약</h2>

      <div className="wd-complete-summary__top">
        <div className="wd-complete-summary__brand">
          <div className="wd-complete-summary__logo" aria-hidden="true">
            UX
          </div>
          <div>
            <div className="wd-complete-summary__title-row">
              <h3>{jobPosting.title}</h3>
              <Badge tone="primary">{jobPosting.employmentType}</Badge>
            </div>
            <p>{company.companyName}</p>
            <span>
              {jobPosting.address} · {jobPosting.workType}
            </span>
          </div>
        </div>

        <div className="wd-complete-summary__status">
          <Badge tone="success">게시중</Badge>
          <span>등록일 {jobPosting.postedAt?.slice(0, 16).replace("T", " ")}</span>
        </div>
      </div>

      <div className="wd-complete-summary__grid">
        {summaryItems.map((item) => (
          <div className="wd-complete-summary__item" key={item.label}>
            <span className={`wd-inline-icon wd-inline-icon--${item.icon}`} aria-hidden="true" />
            <div>
              <strong>{item.label}</strong>
              <span>{values[item.key]}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
