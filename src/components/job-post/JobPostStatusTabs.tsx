type JobPostStatusTabsProps = {
  counts: {
    all: number;
    posted: number;
    draft: number;
    closed: number;
  };
  activeStatus: "all" | "posted" | "draft" | "closed";
  onStatusChange: (status: "all" | "posted" | "draft" | "closed") => void;
};

const tabs = [
  { label: "전체", key: "all" },
  { label: "게시중", key: "posted" },
  { label: "임시저장", key: "draft" },
  { label: "마감", key: "closed" }
] as const;

export function JobPostStatusTabs({ counts, activeStatus, onStatusChange }: JobPostStatusTabsProps) {
  return (
    <div className="wd-job-tabs" role="tablist" aria-label="공고 상태">
      {tabs.map((tab) => (
        <button
          aria-selected={activeStatus === tab.key}
          className={`wd-job-tabs__item ${activeStatus === tab.key ? "is-active" : ""}`}
          key={tab.key}
          onClick={() => onStatusChange(tab.key)}
          role="tab"
          type="button"
        >
          <span>{tab.label}</span>
          <span className="wd-job-tabs__count">{counts[tab.key]}</span>
        </button>
      ))}
    </div>
  );
}
