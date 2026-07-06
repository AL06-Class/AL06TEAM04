import { Button } from "../common/Button";
import { Card } from "../common/Card";

export function CompanyWelcomeBanner() {
  return (
    <Card className="wd-dashboard-banner">
      <div className="wd-dashboard-banner__copy">
        <p className="wd-dashboard-banner__eyebrow">WELCOME TO WONDERDOGS</p>
        <h2>원더독스님, 환영합니다!</h2>
        <p>
          유연근무 채용과 실제 업무 기반 과제로
          <br />
          더 정확한 매칭을 경험해보세요.
        </p>
        <Button href="#" variant="secondary" size="medium">
          <span className="wd-inline-icon wd-inline-icon--info" aria-hidden="true" />
          서비스 이용 가이드 보기
        </Button>
      </div>

      <div className="wd-dashboard-banner__visual" aria-hidden="true">
        <div className="wd-dashboard-banner__screen">
          <span className="wd-dashboard-banner__logo-mark">WD</span>
          <span className="wd-dashboard-banner__top-chip" />
          <div className="wd-dashboard-banner__layout">
            <div className="wd-dashboard-banner__rows">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="wd-dashboard-banner__row" key={index}>
                  <span className="wd-dashboard-banner__avatar" />
                  <div className="wd-dashboard-banner__row-lines">
                    <span />
                    <span />
                  </div>
                  <span className="wd-dashboard-banner__status" />
                </div>
              ))}
            </div>
            <div className="wd-dashboard-banner__chart">
              <span />
            </div>
          </div>
        </div>
        <div className="wd-dashboard-banner__floating-card">
          <span className="wd-dashboard-banner__check" />
          <div>
            <span />
            <span />
          </div>
        </div>
      </div>
    </Card>
  );
}
