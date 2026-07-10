import { PublicHeaderNav } from "../components/common/PublicHeaderNav";
import { routes } from "../routes";

export function LoginPage() {
  return (
    <div className="wd-page">
      <PublicHeaderNav activePath="/login" actionType="login" navType="default" />
      <main className="wd-container wd-login-container">
        <section className="wd-login-panel" aria-labelledby="login-title">
          <div className="wd-login-heading">
            <span className="wd-page-kicker">WONDERDOGs</span>
            <h1 className="wd-page-title" id="login-title">로그인</h1>
          </div>

          <div className="wd-login-card-grid">
            <article className="wd-card wd-login-card">
              <span className="wd-login-card__icon wd-icon wd-icon--company" aria-hidden="true" />
              <div>
                <h2 className="wd-card__title">기업회원</h2>
              </div>
              <a className="wd-button wd-button--primary" href={routes.companyDashboard}>기업회원 로그인</a>
            </article>

            <article className="wd-card wd-login-card">
              <span className="wd-login-card__icon wd-icon wd-icon--user" aria-hidden="true" />
              <div>
                <h2 className="wd-card__title">개인 회원</h2>
              </div>
              <a className="wd-button wd-button--secondary" href={routes.flexibleJobs}>개인회원 로그인</a>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
