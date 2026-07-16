import { useEffect, useMemo, useState } from "react";
import { CompanyHeaderNav } from "../../components/company/CompanyHeaderNav";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { PageContainer } from "../../components/common/PageContainer";
import { JobPostManageFilter } from "../../components/job-post/JobPostManageFilter";
import { JobPostStatusTabs } from "../../components/job-post/JobPostStatusTabs";
import { JobPostTable } from "../../components/job-post/JobPostTable";
import { getCompanyJobPostings } from "../../mocks/jobPostings";
import { fetchCompanyJobPostings } from "../../services/jobPostingRepository";

const pageSize = 5;

function getUniqueOptions(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "ko"));
}

export function JobPostManagePage() {
  const [activeStatus, setActiveStatus] = useState<"all" | "posted" | "draft" | "closed">("all");
  const [occupation, setOccupation] = useState("");
  const [workType, setWorkType] = useState("");
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [companyJobPostings, setCompanyJobPostings] = useState(getCompanyJobPostings);

  useEffect(() => {
    let isActive = true;

    fetchCompanyJobPostings().then((items) => {
      if (!isActive) return;
      setCompanyJobPostings(items);
    });

    return () => {
      isActive = false;
    };
  }, []);

  const counts = useMemo(
    () => ({
      all: companyJobPostings.length,
      posted: companyJobPostings.filter((item) => item.status === "posted").length,
      draft: companyJobPostings.filter((item) => item.status === "draft").length,
      closed: companyJobPostings.filter((item) => item.status === "closed").length
    }),
    [companyJobPostings]
  );

  const filterOptions = useMemo(
    () => ({
      occupations: getUniqueOptions(companyJobPostings.map((item) => item.jobCategory)),
      workTypes: getUniqueOptions(companyJobPostings.map((item) => item.workType))
    }),
    [companyJobPostings]
  );

  const filteredJobPostings = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return companyJobPostings.filter((item) => {
      const matchesStatus = activeStatus === "all" ? true : item.status === activeStatus;
      const matchesOccupation = occupation ? item.jobCategory === occupation : true;
      const matchesWorkType = workType ? item.workType === workType : true;
      const matchesKeyword = normalizedKeyword
        ? item.title.toLowerCase().includes(normalizedKeyword) ||
          item.jobTitle.toLowerCase().includes(normalizedKeyword)
        : true;

      return matchesStatus && matchesOccupation && matchesWorkType && matchesKeyword;
    });
  }, [activeStatus, companyJobPostings, keyword, occupation, workType]);

  const pageCount = Math.max(1, Math.ceil(filteredJobPostings.length / pageSize));
  const paginatedJobPostings = filteredJobPostings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus, keyword, occupation, workType]);

  useEffect(() => {
    if (currentPage > pageCount) setCurrentPage(pageCount);
  }, [currentPage, pageCount]);

  return (
    <div className="wd-company-page">
      <CompanyHeaderNav activePath="/company/job-posts" />

      <PageContainer>
        <Card className="wd-job-manage-toolbar">
          <JobPostStatusTabs activeStatus={activeStatus} counts={counts} onStatusChange={setActiveStatus} />
          <JobPostManageFilter
            keyword={keyword}
            occupation={occupation}
            occupationOptions={filterOptions.occupations}
            onKeywordChange={setKeyword}
            onOccupationChange={setOccupation}
            onWorkTypeChange={setWorkType}
            workType={workType}
            workTypeOptions={filterOptions.workTypes}
          />
          <div className="wd-job-manage-toolbar__action">
            <Button href="/company/job-posts/new" size="large">
              <span className="wd-inline-icon wd-inline-icon--plus" aria-hidden="true" />
              새 공고 등록하기
            </Button>
          </div>
        </Card>

        <Card className="wd-job-manage-table-card">
          <JobPostTable
            currentPage={currentPage}
            jobPostings={paginatedJobPostings}
            onPageChange={setCurrentPage}
            pageCount={pageCount}
            pageSize={pageSize}
            totalCount={filteredJobPostings.length}
          />
        </Card>
      </PageContainer>
    </div>
  );
}
