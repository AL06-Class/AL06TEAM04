import { CompanyHeaderNav } from "../../components/company/CompanyHeaderNav";
import { Button } from "../../components/common/Button";
import { PageContainer } from "../../components/common/PageContainer";
import { JobPostCompleteSummaryCard } from "../../components/job-post/JobPostCompleteSummaryCard";
import { companyMock } from "../../mocks/company";
import { jobPostingsMock } from "../../mocks/jobPostings";

type JobPostCompletePageProps = {
  jobPostingId: string;
};

export function JobPostCompletePage({ jobPostingId }: JobPostCompletePageProps) {
  const jobPosting =
    jobPostingsMock.find((item) => item.jobPostingId === jobPostingId) ?? jobPostingsMock[0];

  return (
    <div className="wd-company-page">
      <CompanyHeaderNav activePath="/company/job-posts/complete" />

      <PageContainer>
        <section className="wd-complete-page">
          <div className="wd-complete-page__hero">
            <div className="wd-complete-page__icon" aria-hidden="true">
              <span />
            </div>
            <h1>
              공고가 <strong>등록되었습니다!</strong>
            </h1>
            <p>
              등록하신 채용 공고가 WONDERDOGs에 성공적으로 등록되었습니다.
              <br />
              지금 바로 인재들의 지원을 받아보세요.
            </p>
          </div>

          <JobPostCompleteSummaryCard company={companyMock} jobPosting={jobPosting} />

          <div className="wd-complete-page__actions">
            <Button href={`/job-posts/${jobPosting.jobPostingId}`} size="large">
              <span className="wd-inline-icon wd-inline-icon--external" aria-hidden="true" />
              <span className="wd-complete-page__action-copy">
                <strong>등록된 공고 보기</strong>
                <span>구직자에게 보여지는 공고 페이지를 확인하세요.</span>
              </span>
              <span className="wd-inline-icon wd-inline-icon--arrow-right" aria-hidden="true" />
            </Button>

            <div className="wd-complete-page__sub-actions">
              <Button href="/company/job-posts" size="large" variant="secondary">
                <span className="wd-inline-icon wd-inline-icon--document" aria-hidden="true" />
                <span className="wd-complete-page__sub-copy">
                  <strong>공고 관리로 이동</strong>
                  <span>등록한 공고를 관리하고 수정할 수 있어요.</span>
                </span>
                <span className="wd-inline-icon wd-inline-icon--arrow-right" aria-hidden="true" />
              </Button>

              <Button href="#" size="large" variant="secondary">
                <span className="wd-inline-icon wd-inline-icon--plus" aria-hidden="true" />
                <span className="wd-complete-page__sub-copy">
                  <strong>새 공고 등록하기</strong>
                  <span>새로운 채용 공고를 등록해보세요.</span>
                </span>
                <span className="wd-inline-icon wd-inline-icon--arrow-right" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <p className="wd-complete-page__help">
            <span className="wd-inline-icon wd-inline-icon--help" aria-hidden="true" />
            궁금한 점이 있으신가요? <a href="#">고객센터</a>에서 도움을 받아보세요.
          </p>
        </section>
      </PageContainer>
    </div>
  );
}
