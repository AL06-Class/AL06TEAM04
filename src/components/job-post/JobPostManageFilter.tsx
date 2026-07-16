type JobPostManageFilterProps = {
  occupation: string;
  workType: string;
  keyword: string;
  occupationOptions: string[];
  workTypeOptions: string[];
  onOccupationChange: (value: string) => void;
  onWorkTypeChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
};

export function JobPostManageFilter({
  occupation,
  workType,
  keyword,
  occupationOptions,
  workTypeOptions,
  onOccupationChange,
  onWorkTypeChange,
  onKeywordChange
}: JobPostManageFilterProps) {
  const occupationLabel = occupation || "전체 직무";
  const workTypeLabel = workType || "전체 근무 방식";

  return (
    <div className="wd-job-filter">
      <label className="wd-job-filter__control">
        <span className="wd-job-filter__value">{occupationLabel}</span>
        <select value={occupation} onChange={(event) => onOccupationChange(event.target.value)}>
          <option value="">전체 직무</option>
          {occupationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="wd-inline-icon wd-inline-icon--chevron-down" aria-hidden="true" />
      </label>
      <label className="wd-job-filter__control">
        <span className="wd-job-filter__value">{workTypeLabel}</span>
        <select value={workType} onChange={(event) => onWorkTypeChange(event.target.value)}>
          <option value="">전체 근무 방식</option>
          {workTypeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="wd-inline-icon wd-inline-icon--chevron-down" aria-hidden="true" />
      </label>
      <button className="wd-job-filter__control" type="button">
        최근 수정일
        <span className="wd-inline-icon wd-inline-icon--calendar" aria-hidden="true" />
      </button>
      <label className="wd-job-filter__search">
        <span className="wd-job-filter__search-label">공고명 검색</span>
        <input
          placeholder="공고명 검색"
          type="text"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
        />
        <span className="wd-inline-icon wd-inline-icon--search" aria-hidden="true" />
      </label>
    </div>
  );
}
