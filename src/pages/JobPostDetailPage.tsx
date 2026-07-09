import gangnamMapMockup from "../assets/map-mockup-gangnam.png";
import { CompanyHeaderNav } from "../components/company/CompanyHeaderNav";
import { Button } from "../components/common/Button";
import { PageContainer } from "../components/common/PageContainer";
import { companyMock } from "../mocks/company";
import { jobPostingsMock } from "../mocks/jobPostings";

type JobPostDetailPageProps = {
  jobPostingId: string;
};

const detailFallback = {
  title: "UI/UX 디자이너",
  companyName: "원더독스",
  employmentType: "정규직",
  experience: "1년 이상 ~ 3년 이하",
  education: "학력무관",
  salary: "면접 후 결정",
  address: "서울 강남구 테헤란로, 삼성역 도보 7분",
  workTime: "일 4시간 · 10:00 - 15:00",
  applicationPeriod: "2026.07.08 13시 ~ 2026.08.08 24시",
  workModes: ["출근중심", "원격근무", "시차 출퇴근", "시간 선택", "단축 근무", "월", "수", "금"],
  requirements: ["Figma 등 디자인 툴 활용이 능숙한 분", "서비스 UX 설계 경험이 있는 분"],
  preferences: ["SaaS, 플랫폼 서비스 디자인 경험", "데이터 분석 기반 UX 개선 경험"],
  process: ["서류전형", "1차면접", "2차면접", "최종합격"],
  assignmentTitle: "공고 업무에 맞는 사전 과제",
  assignmentSummary: "지원자의 실제 업무 이해도와 문제 해결 방식을 확인할 수 있는 사전 과제가 연결됩니다."
};

export function JobPostDetailPage({ jobPostingId }: JobPostDetailPageProps) {
  const jobPosting = jobPostingsMock.find((item) => item.jobPostingId === jobPostingId) ?? jobPostingsMock[0];
  const isCreatedPosting = jobPosting.jobPostingId === "job-posting-2026-07-001";
  const title = isCreatedPosting ? detailFallback.title : jobPosting.title;
  const companyName = jobPosting.companyId === companyMock.companyId ? detailFallback.companyName : companyMock.companyName;
  const employmentType = isCreatedPosting ? detailFallback.employmentType : jobPosting.employmentType;
  const experience = isCreatedPosting ? detailFallback.experience : jobPosting.experienceLevel;
  const salary = isCreatedPosting ? detailFallback.salary : jobPosting.salaryText;
  const address = isCreatedPosting ? detailFallback.address : jobPosting.roadAddress || jobPosting.address;
  const workModes = isCreatedPosting
    ? detailFallback.workModes
    : [jobPosting.workType, ...jobPosting.flexibleWorkTypes, ...jobPosting.workDays].filter(Boolean);

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
                <span className="wd-chip wd-chip--soft">{employmentType}</span>
                <span className="wd-chip wd-chip--soft">{experience}</span>
                <span className="wd-chip wd-chip--soft">{salary}</span>
              </div>
            </section>

            <section className="wd-job-detail-section">
              <h2>유연근무 조건</h2>
              <div className="wd-job-detail-summary-grid">
                <DetailItem label="근무지" value={address} />
                <DetailItem label="근무 시간" value={detailFallback.workTime} />
                <DetailItem label="근무요일" value="월, 수, 금" />
                <DetailItem label="접수기간" value={detailFallback.applicationPeriod} />
              </div>
              <div className="wd-chip-row">
                {workModes.map((mode) => (
                  <span className="wd-chip" key={mode}>{mode}</span>
                ))}
              </div>
            </section>

            <section className="wd-job-detail-section">
              <h2>업무 상세</h2>
              <div className="wd-job-detail-summary-grid">
                <DetailItem label="직무" value={title} />
                <DetailItem label="경력" value={experience} />
                <DetailItem label="학력" value={detailFallback.education} />
                <DetailItem label="고용형태" value={`${employmentType} · 수습기간 3개월`} />
              </div>
            </section>

            <section className="wd-job-detail-section">
              <h2>추가항목</h2>
              <div className="wd-job-detail-list-grid">
                <DetailList title="자격요건" items={detailFallback.requirements} />
                <DetailList title="우대사항" items={detailFallback.preferences} />
              </div>
            </section>

            <section className="wd-job-detail-section">
              <h2>채용절차</h2>
              <ol className="wd-job-detail-process">
                {detailFallback.process.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          </article>

          <aside className="wd-job-detail-side">
            <div className="wd-job-detail-apply-card">
              <span>지원 전 확인</span>
              <h2>{title}</h2>
              <p>{companyName} · {employmentType}</p>
              <Button fullWidth size="large">지원하기</Button>
              <Button fullWidth href="/company/job-posts" size="medium" variant="secondary">공고 관리로 돌아가기</Button>
            </div>

            <div className="wd-job-detail-map-card">
              <img src={gangnamMapMockup} alt="서울 강남구 테헤란로 인근 지도" />
              <div>
                <strong>{address}</strong>
                <span>지도 위치보기</span>
              </div>
            </div>

            <div className="wd-job-detail-assignment-card">
              <span>사전과제</span>
              <h3>{detailFallback.assignmentTitle}</h3>
              <p>{detailFallback.assignmentSummary}</p>
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
