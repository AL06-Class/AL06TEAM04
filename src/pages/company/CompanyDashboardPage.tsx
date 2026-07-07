import { CompanyActionCard } from "../../components/company/CompanyActionCard";
import { CompanyHeaderNav } from "../../components/company/CompanyHeaderNav";
import { CompanyWelcomeBanner } from "../../components/company/CompanyWelcomeBanner";
import { RecentStatusPanel } from "../../components/company/RecentStatusPanel";
import { Card } from "../../components/common/Card";
import { PageContainer } from "../../components/common/PageContainer";
import { dashboardStatusMock } from "../../mocks/jobPostings";

export function CompanyDashboardPage() {
  return (
    <div className="wd-company-page">
      <CompanyHeaderNav activePath="/company" />

      <PageContainer>
        <section className="wd-page-heading">
          <h1>기업 대시보드</h1>
          <p>
            <strong>원더독스님</strong>, 오늘도 멋진 인재와의 연결을 응원합니다.
          </p>
        </section>

        <CompanyWelcomeBanner />

        <section className="wd-dashboard-grid">
          <CompanyActionCard
            buttonLabel="공고 관리로 이동"
            description="유연근무 채용 공고를 등록하고 게시 상태와 마감을 관리하세요."
            href="/company/job-posts"
            icon="job-post"
            items={["공고 등록 및 수정", "게시 상태 및 마감 관리", "공고 미리보기"]}
            title="공고 관리"
          />

          <CompanyActionCard
            buttonLabel="과제 관리로 이동"
            description="실제 업무 기반 과제를 등록하고 지원자의 과제 제출 현황을 관리하세요."
            href="/company/assignments"
            icon="assignment"
            items={["과제 등록 및 수정", "과제 제출 현황 확인", "과제 평가 및 피드백 관리"]}
            title="과제 관리"
          />

          <RecentStatusPanel
            assignmentCount={dashboardStatusMock.assignments}
            draftCount={dashboardStatusMock.draft}
            postedCount={dashboardStatusMock.posted}
          />
        </section>

        <Card className="wd-notice-bar">
          <div className="wd-notice-bar__left">
            <span className="wd-inline-icon wd-inline-icon--bell" aria-hidden="true" />
            <span>원더독스의 새로운 소식을 확인해보세요</span>
          </div>
          <a href="#">더보기</a>
        </Card>
      </PageContainer>
    </div>
  );
}
