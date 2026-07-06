export function JobPostManageFilter() {
  return (
    <div className="wd-job-filter">
      <button className="wd-job-filter__control" type="button">
        전체 직무
        <span className="wd-inline-icon wd-inline-icon--chevron-down" aria-hidden="true" />
      </button>
      <button className="wd-job-filter__control" type="button">
        전체 근무 방식
        <span className="wd-inline-icon wd-inline-icon--chevron-down" aria-hidden="true" />
      </button>
      <button className="wd-job-filter__control" type="button">
        최근 수정일
        <span className="wd-inline-icon wd-inline-icon--calendar" aria-hidden="true" />
      </button>
      <label className="wd-job-filter__search">
        <span className="wd-job-filter__search-label">공고명 검색</span>
        <input placeholder="공고명 검색" type="text" />
        <span className="wd-inline-icon wd-inline-icon--search" aria-hidden="true" />
      </label>
    </div>
  );
}
