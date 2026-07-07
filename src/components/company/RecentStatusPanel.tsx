import { Card } from "../common/Card";

type RecentStatusPanelProps = {
  postedCount: number;
  draftCount: number;
  assignmentCount: number;
};

const items = [
  { key: "postedCount", label: "게시중 공고", tone: "purple" },
  { key: "draftCount", label: "임시저장 공고", tone: "orange" },
  { key: "assignmentCount", label: "등록 과제", tone: "green" }
] as const;

export function RecentStatusPanel({
  postedCount,
  draftCount,
  assignmentCount
}: RecentStatusPanelProps) {
  const valueMap = {
    postedCount,
    draftCount,
    assignmentCount
  };

  return (
    <Card className="wd-status-panel">
      <div className="wd-status-panel__header">
        <h3>최근 등록 현황</h3>
        <a href="/company/job-posts">전체 보기</a>
      </div>

      <div className="wd-status-panel__items">
        {items.map((item) => (
          <div className="wd-status-panel__item" key={item.label}>
            <div className="wd-status-panel__label">
              <span className={`wd-status-panel__icon wd-status-panel__icon--${item.tone}`} aria-hidden="true" />
              <span>{item.label}</span>
            </div>
            <div className="wd-status-panel__value">
              <strong>{valueMap[item.key]}</strong>
              <span>건</span>
              <span className="wd-status-panel__arrow" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
