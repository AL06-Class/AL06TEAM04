import { useState } from "react";
import { Badge } from "../common/Badge";
import type { JobPosting } from "../../types/jobPosting";

type JobPostTableProps = {
  jobPostings: JobPosting[];
  totalCount: number;
  currentPage?: number;
  pageCount?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
};

function getStatusBadge(status: JobPosting["status"]) {
  if (status === "posted") {
    return (
      <Badge tone="success" withDot>
        게시중
      </Badge>
    );
  }

  if (status === "draft") {
    return (
      <Badge tone="info" withDot>
        임시저장
      </Badge>
    );
  }

  return (
    <Badge tone="neutral" withDot>
      마감
    </Badge>
  );
}

export function JobPostTable({
  jobPostings,
  totalCount,
  currentPage = 1,
  pageCount = 1,
  pageSize = 5,
  onPageChange
}: JobPostTableProps) {
  const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className="wd-job-table">
      <div className="wd-job-table__header wd-job-table__row">
        <span>공고명</span>
        <span>직무</span>
        <span>근무 방식</span>
        <span>게시 상태</span>
        <span>최근 수정일</span>
        <span>관리</span>
      </div>

      {jobPostings.map((jobPosting) => (
        <div className="wd-job-table__row" key={jobPosting.jobPostingId}>
          <div className="wd-job-table__title">
            <strong>{jobPosting.title}</strong>
            <div className="wd-job-table__meta">
              <span>공고 ID {jobPosting.jobPostingId.replace("job-posting-", "")}</span>
              {jobPosting.isRecommended ? <Badge tone="primary">추천 공고</Badge> : null}
            </div>
          </div>

          <div className="wd-job-table__cell-text">
            <strong>{jobPosting.jobCategory}</strong>
            <span>{jobPosting.jobTitle}</span>
          </div>

          <div className="wd-job-table__cell-text">
            <strong>{jobPosting.workType}</strong>
            <span>{jobPosting.address}</span>
          </div>

          <div>{getStatusBadge(jobPosting.status)}</div>

          <div className="wd-job-table__date">{jobPosting.updatedAt.slice(0, 16).replace("T", " ")}</div>

          <div className="wd-job-table__actions">
            <a className="wd-job-table__outline" href="#">
              편집
            </a>
            <button className="wd-job-table__link wd-job-table__link--disabled" type="button">
              미리보기
            </button>
            <a className="wd-job-table__link" href="#">
              지원현황
            </a>
            <div className="wd-job-table__menu">
              <button
                aria-label="더보기"
                className="wd-job-table__more"
                type="button"
                onClick={() =>
                  setOpenedMenuId((current) => (current === jobPosting.jobPostingId ? null : jobPosting.jobPostingId))
                }
              >
                <span />
                <span />
                <span />
              </button>
              {openedMenuId === jobPosting.jobPostingId ? (
                <div className="wd-job-table__menu-popover">
                  <button className="wd-job-table__menu-item wd-job-table__menu-item--danger" type="button">
                    삭제
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}

      {jobPostings.length === 0 ? <div className="wd-empty-inline">조건에 맞는 공고가 없습니다.</div> : null}

      <div className="wd-job-table__footer">
        <div className="wd-job-table__total">
          <span>전체 {totalCount}개</span>
          <button className="wd-job-filter__control wd-job-filter__control--small" type="button">
            {pageSize}개씩 보기
            <span className="wd-inline-icon wd-inline-icon--chevron-down" aria-hidden="true" />
          </button>
        </div>

        {pageCount > 1 ? (
          <div className="wd-job-table__pagination" aria-label="페이지 이동">
            <button type="button" disabled={currentPage === 1} onClick={() => onPageChange?.(1)}>
              처음
            </button>
            <button type="button" disabled={currentPage === 1} onClick={() => onPageChange?.(currentPage - 1)}>
              이전
            </button>
            {pages.map((page) => (
              <button
                className={page === currentPage ? "is-active" : ""}
                key={page}
                type="button"
                onClick={() => onPageChange?.(page)}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === pageCount}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              다음
            </button>
            <button type="button" disabled={currentPage === pageCount} onClick={() => onPageChange?.(pageCount)}>
              마지막
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
