import { CompanyHeaderNav } from "../../components/company/CompanyHeaderNav";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { PageContainer } from "../../components/common/PageContainer";
import { JobPostManageFilter } from "../../components/job-post/JobPostManageFilter";
import { JobPostStatusTabs } from "../../components/job-post/JobPostStatusTabs";
import { JobPostTable } from "../../components/job-post/JobPostTable";
import { jobPostingsMock } from "../../mocks/jobPostings";

const counts = {
  all: 12,
  posted: 6,
  draft: 3,
  closed: 3
} as const;

export function JobPostManagePage() {
  return (
    <div className="wd-company-page">
      <CompanyHeaderNav activePath="/company/job-posts" />

      <PageContainer>
        <section className="wd-page-heading wd-page-heading--with-action">
          <div>
            <h1>공고 관리</h1>
            <p>등록한 채용 공고를 한눈에 확인하고 관리할 수 있습니다.</p>
          </div>
          <Button href="#" size="large">
            <span className="wd-inline-icon wd-inline-icon--plus" aria-hidden="true" />
            새 공고 등록하기
          </Button>
        </section>

        <Card className="wd-job-manage-toolbar">
          <JobPostStatusTabs activeStatus="all" counts={counts} />
          <JobPostManageFilter />
        </Card>

        <Card className="wd-job-manage-table-card">
          <JobPostTable jobPostings={jobPostingsMock} />
        </Card>
      </PageContainer>
    </div>
  );
}
