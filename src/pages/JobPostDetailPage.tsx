import { useEffect, useState } from "react";
import gangnamMapMockup from "../assets/map-mockup-gangnam.png";
import { CompanyHeaderNav } from "../components/company/CompanyHeaderNav";
import { Button } from "../components/common/Button";
import { PageContainer } from "../components/common/PageContainer";
import { getPublicJobPostings } from "../mocks/jobPostings";
import { fetchPublicJobPostings } from "../services/jobPostingRepository";

type JobPostDetailPageProps = {
  jobPostingId: string;
};

export function JobPostDetailPage({ jobPostingId }: JobPostDetailPageProps) {
  const [jobPostings, setJobPostings] = useState(getPublicJobPostings);

  useEffect(() => {
    let isActive = true;

    fetchPublicJobPostings().then((items) => {
      if (!isActive) return;
      setJobPostings(items);
    });

    return () => {
      isActive = false;
    };
  }, []);

  const jobPosting = jobPostings.find((item) => item.jobPostingId === jobPostingId) ?? jobPostings[0];
  const title = jobPosting.title;
  const companyName = jobPosting.companyName ?? jobPosting.companyId;
  const address = jobPosting.roadAddress || jobPosting.address;
  const workModes = Array.from(new Set([jobPosting.workType, ...jobPosting.flexibleWorkTypes, ...jobPosting.workDays].filter(Boolean)));
  const requirements = jobPosting.requirements ?? jobPosting.requiredSkills;
  const preferences = jobPosting.preferences ?? [];
  const hiringProcess = jobPosting.hiringProcess ?? ["서류 검토", "실무 인터뷰", "최종 인터뷰"];

  return (
    <div className="wd-company-page wd-job-detail-page">
      <CompanyHeaderNav activePath="/company/job-posts" />

      <PageContainer>
        <main className="wd-job-detail-layout">
          <article className="wd-job-detail-main">
            <section className="wd-job-detail-hero">
              <div className="wd-job-detail-hero__eyebrow">
                <span>등록된 공고</span>
                <strong>지원자에게 공개 중</strong>
              </div>
              <h1>{title}</h1>
              <p>{companyName}</p>
              <div className="wd-chip-row">
                <span className="wd-chip wd-chip--soft">{jobPosting.employmentType}</span>
                <span className="wd-chip wd-chip--soft">{jobPosting.experienceLevel}</span>
                <span className="wd-chip wd-chip--soft">{jobPosting.salaryText}</span>
              </div>
            </section>

            <section className="wd-job-detail-section">
              <h2>유연근무 조건</h2>
              <div className="wd-job-detail-summary-grid">
                <DetailItem label="근무지" value={address} />
                <DetailItem label="근무 시간" value={jobPosting.workTimeText ?? "시간 협의 가능"} />
                <DetailItem label="근무요일" value={jobPosting.workDays.join(", ")} />
                <DetailItem label="접수기간" value={jobPosting.applicationPeriod ?? "채용 시 마감"} />
              </div>
              <div className="wd-chip-row">
                {workModes.map((mode) => (
                  <span className="wd-chip" key={mode}>
                    {mode}
                  </span>
                ))}
              </div>
            </section>

            <section className="wd-job-detail-section">
              <h2>업무 상세</h2>
              <div className="wd-job-detail-summary-grid">
                <DetailItem label="직무" value={jobPosting.jobTitle} />
                <DetailItem label="경력" value={jobPosting.experienceLevel} />
                <DetailItem label="주요 업무" value={jobPosting.mainResponsibilities} />
                <DetailItem label="고용형태" value={jobPosting.employmentType} />
              </div>
            </section>

            <section className="wd-job-detail-section">
              <h2>추가 항목</h2>
              <div className="wd-job-detail-list-grid">
                <DetailList title="자격요건" items={requirements} />
                <DetailList title="우대사항" items={preferences} />
              </div>
            </section>

            <section className="wd-job-detail-section">
              <h2>채용절차</h2>
              <ol className="wd-job-detail-process">
                {hiringProcess.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          </article>

          <aside className="wd-job-detail-side">
            <div className="wd-job-detail-apply-card">
              <span>지원 전 확인</span>
              <h2>{title}</h2>
              <p>
                {companyName} · {jobPosting.employmentType}
              </p>
              <Button fullWidth size="large">
                지원하기
              </Button>
            </div>

            <div className="wd-job-detail-map-card">
              <img src={gangnamMapMockup} alt="삼성역 근처 지도" />
              <div>
                <strong>{address}</strong>
                <span>
                  {jobPosting.primaryStationName} 도보 {jobPosting.stationWalkMinutes ?? 7}분
                </span>
              </div>
            </div>

            <div className="wd-job-detail-assignment-card">
              <span>과제</span>
              <h3>{jobPosting.assignmentTitle ?? "공고 업무에 맞는 사전과제"}</h3>
              <p>{jobPosting.assignmentSummary ?? "지원자의 실제 업무 이해도와 문제 해결 방식을 확인하는 과제가 연결됩니다."}</p>
            </div>
          </aside>
        </main>
      </PageContainer>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="wd-job-detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="wd-job-detail-list">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
