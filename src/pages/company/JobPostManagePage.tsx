import { useMemo, useState } from "react";
import { CompanyHeaderNav } from "../../components/company/CompanyHeaderNav";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { PageContainer } from "../../components/common/PageContainer";
import { JobPostManageFilter } from "../../components/job-post/JobPostManageFilter";
import { JobPostStatusTabs } from "../../components/job-post/JobPostStatusTabs";
import { JobPostTable } from "../../components/job-post/JobPostTable";
import { jobPostingsMock } from "../../mocks/jobPostings";

export function JobPostManagePage() {
  const [activeStatus, setActiveStatus] = useState<"all" | "posted" | "draft" | "closed">("all");
  const [occupation, setOccupation] = useState("");
  const [workType, setWorkType] = useState("");
  const [keyword, setKeyword] = useState("");

  const counts = useMemo(
    () => ({
      all: jobPostingsMock.length,
      posted: jobPostingsMock.filter((item) => item.status === "posted").length,
      draft: jobPostingsMock.filter((item) => item.status === "draft").length,
      closed: jobPostingsMock.filter((item) => item.status === "closed").length
    }),
    []
  );

  const filteredJobPostings = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return jobPostingsMock.filter((item) => {
      const matchesStatus = activeStatus === "all" ? true : item.status === activeStatus;
      const matchesOccupation = occupation ? item.jobCategory === occupation : true;
      const matchesWorkType = workType ? item.workType === workType : true;
      const matchesKeyword = normalizedKeyword
        ? item.title.toLowerCase().includes(normalizedKeyword) ||
          item.jobTitle.toLowerCase().includes(normalizedKeyword)
        : true;

      return matchesStatus && matchesOccupation && matchesWorkType && matchesKeyword;
    });
  }, [activeStatus, keyword, occupation, workType]);

  return (
    <div className="wd-company-page">
      <CompanyHeaderNav activePath="/company/job-posts" />

      <PageContainer>
        <Card className="wd-job-manage-toolbar">
          <JobPostStatusTabs activeStatus={activeStatus} counts={counts} onStatusChange={setActiveStatus} />
          <JobPostManageFilter
            keyword={keyword}
            occupation={occupation}
            onKeywordChange={setKeyword}
            onOccupationChange={setOccupation}
            onWorkTypeChange={setWorkType}
            workType={workType}
          />
          <div className="wd-job-manage-toolbar__action">
            <Button href="/company/job-posts/new" size="large">
              <span className="wd-inline-icon wd-inline-icon--plus" aria-hidden="true" />
              새 공고 등록하기
            </Button>
          </div>
        </Card>

        <Card className="wd-job-manage-table-card">
          <JobPostTable jobPostings={filteredJobPostings} totalCount={filteredJobPostings.length} />
        </Card>
      </PageContainer>
    </div>
  );
}
