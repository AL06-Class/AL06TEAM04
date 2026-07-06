import gangnamMapMockup from "./assets/map-mockup-gangnam.png";
import wonderdogsLogo from "./assets/wonderdogs-logo.png";
import { CompanyDashboardPage } from "./pages/company/CompanyDashboardPage";
import { JobPostCompletePage } from "./pages/company/JobPostCompletePage";
import { JobPostManagePage } from "./pages/company/JobPostManagePage";

const recommendedJobPostings = [
  {
    jobPostingId: "jobPosting_lavender_01",
    companyName: "라벤더랩스",
    jobTitle: "콘텐츠 디자이너",
    status: "posted",
    summary: "재택 병행 · 주 4일 · 실무 과제 있음",
    matchBadge: "완전 매칭",
    matchBadgeStyle: "success"
  },
  {
    jobPostingId: "jobPosting_purple_01",
    companyName: "퍼플워크",
    jobTitle: "서비스 운영 매니저",
    status: "posted",
    summary: "오전 집중근무 · 3.2km · 실무 과제 있음",
    matchBadge: "공고 연결됨",
    matchBadgeStyle: "info"
  }
];

const valueCards = [
  {
    icon: "pin",
    title: "위치 기반 유연근무",
    meta: "거리, 요일, 시간을 함께 비교해 실제로 출근 가능한 공고를 먼저 보여줍니다."
  },
  {
    icon: "task",
    title: "실무 과제 중심 매칭",
    meta: "공고와 과제를 연결해 지원자가 업무를 더 정확히 이해할 수 있게 합니다."
  },
  {
    icon: "match",
    title: "기업과 인재 동시 매칭",
    meta: "구직자는 맞는 일자리를, 기업은 필요한 인재를 한 흐름에서 찾을 수 있습니다."
  }
];

const heroHighlights = [
  { value: "역 도보 10분", label: "가까운 접근성" },
  { value: "유연근무", label: "조건 중심 비교" },
  { value: "실무 과제", label: "더 정확한 매칭" }
];

const routes = {
  home: "/",
  login: "/login",
  companyDashboard: "/company",
  jobPostManage: "/company/job-posts"
};

export default function App() {
  const pathname = window.location.pathname;
  const completeMatch = pathname.match(/^\/company\/job-posts\/([^/]+)\/complete$/);

  if (pathname === routes.login) {
    return <LoginPage />;
  }

  if (pathname === routes.companyDashboard) {
    return <CompanyDashboardPage />;
  }

  if (pathname === routes.jobPostManage) {
    return <JobPostManagePage />;
  }

  if (completeMatch) {
    return <JobPostCompletePage jobPostingId={completeMatch[1]} />;
  }

  return (
    <div className="wd-page">
      <Header />

      <main className="wd-container">
        <section className="wd-panel wd-hero" aria-labelledby="main-title">
          <div className="wd-hero__main">
            <div className="wd-hero__copy">
              <div>
                <h1 className="wd-title" id="main-title">
                  <span className="wd-title__line">
                    <span className="wd-title__highlight">유연근무</span> 채용과 인재를 찾고,
                  </span>
                  <span className="wd-title__line">
                    실무 <span className="wd-title__highlight">과제로 연결</span>하는
                  </span>
                  <span className="wd-title__line">채용 플랫폼</span>
                </h1>
                <p className="wd-description">
                  WONDERDOGs는 기업과 구직자가 가까운 위치에서 만나고, 유연근무 조건까지
                  맞는 채용을 연결합니다.
                </p>
                <div className="wd-actions">
                  <span className="wd-button wd-button--primary">
                    <span className="wd-button__icon wd-icon wd-icon--pin" aria-hidden="true" />
                    유연근무 공고
                  </span>
                  <span className="wd-button wd-button--secondary">
                    <span className="wd-button__icon wd-icon wd-icon--search" aria-hidden="true" />
                    경력자 찾기
                  </span>
                </div>
                <div className="wd-hero-highlights" aria-label="핵심 기준">
                  {heroHighlights.map((item) => (
                    <div className="wd-hero-highlight" key={item.value}>
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="wd-preview" aria-label="추천 공고 미리보기">
              <div
                className="wd-preview__map wd-preview__map--image"
                style={{ backgroundImage: `url(${gangnamMapMockup})` }}
              >
                <span className="wd-map-filter">지하철역 도보 10분</span>
                <span className="wd-map-location" aria-label="내 위치" />
                <span className="wd-map-marker wd-map-marker--one" aria-label="추천 공고 1">
                  1
                </span>
                <span className="wd-map-marker wd-map-marker--two" aria-label="추천 공고 2">
                  2
                </span>
                <span className="wd-map-marker wd-map-marker--three" aria-label="추천 공고 3">
                  3
                </span>
              </div>
            </aside>
          </div>

          <div className="wd-card-list wd-card-list--featured">
            {recommendedJobPostings.map((jobPosting) => (
              <article className="wd-card wd-job-card" key={jobPosting.jobPostingId}>
                <span className={`wd-badge wd-badge--${jobPosting.matchBadgeStyle}`}>
                  {jobPosting.matchBadge}
                </span>
                <div>
                  <h2 className="wd-card__title">{jobPosting.companyName}</h2>
                  <p className="wd-card__meta">{jobPosting.jobTitle}</p>
                </div>
                <p className="wd-card__meta">{jobPosting.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wd-section-grid" aria-label="핵심 가치">
          {valueCards.map((card) => (
            <article className="wd-card wd-value-card" key={card.title}>
              <span className={`wd-value-card__icon wd-value-card__icon--${card.icon}`} aria-hidden="true">
                <span className={`wd-value-icon wd-value-icon--${card.icon}`} />
              </span>
              <div>
                <h2 className="wd-card__title">{card.title}</h2>
                <p className="wd-card__meta">{card.meta}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
function Header() {
  return (
    <header className="wd-header">
      <a className="wd-logo" href={routes.home} aria-label="WONDERDOGs 홈">
        <img className="wd-logo__image" src={wonderdogsLogo} alt="WONDERDOGs" />
      </a>
      <nav className="wd-nav" aria-label="주요 메뉴">
        <span className="wd-nav__active">유연근무 공고</span>
        <span>경력자 찾기</span>
        <span>채용 도우미</span>
        <span>이용 안내</span>
        <span>고객센터</span>
      </nav>
      <a className="wd-button wd-button--primary wd-button--compact" href={routes.login}>
        <span className="wd-button__icon wd-icon wd-icon--user" aria-hidden="true" />
        로그인
      </a>
    </header>
  );
}

function LoginPage() {
  return (
    <div className="wd-page">
      <Header />
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
                <h2 className="wd-card__title">구직자</h2>
              </div>
              <a className="wd-button wd-button--secondary" href={routes.jobPostManage}>구직자 로그인</a>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
