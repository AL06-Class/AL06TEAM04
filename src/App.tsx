import { useEffect, useState } from "react";
import gangnamMapMockup from "./assets/map-mockup-gangnam.png";
import { PageContainer } from "./components/common/PageContainer";
import { PublicHeaderNav } from "./components/common/PublicHeaderNav";
import { AssignmentPage } from "./pages/company/AssignmentPage";
import { CompanyDashboardPage } from "./pages/company/CompanyDashboardPage";
import { JobPostCompletePage } from "./pages/company/JobPostCompletePage";
import { JobPostCreatePage } from "./pages/company/JobPostCreatePage";
import { JobPostManagePage } from "./pages/company/JobPostManagePage";
import { FlexibleJobsPage } from "./pages/FlexibleJobsPage";
import { JobPostDetailPage } from "./pages/JobPostDetailPage";

const recommendedJobPostings = [
  {
    jobPostingId: "jobPosting_lavender_01",
    companyName: "라벤더랩스",
    jobTitle: "콘텐츠 디자이너",
    status: "posted",
    summary: "재택 병행 · 주 4일 · 과제 있음",
    matchBadge: "완전 매칭",
    matchBadgeStyle: "success"
  },
  {
    jobPostingId: "jobPosting_purple_01",
    companyName: "퍼플워크",
    jobTitle: "서비스 운영 매니저",
    status: "posted",
    summary: "오전 집중근무 · 3.2km · 과제 있음",
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
    title: "과제 중심 매칭",
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
  { value: "과제", label: "더 정확한 매칭" }
];

const routes = {
  home: "/",
  login: "/login",
  flexibleJobs: "/flexible-jobs",
  companyDashboard: "/company",
  jobPostManage: "/company/job-posts"
};

type PendingRoutePageProps = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const syncPathname = () => setPathname(window.location.pathname);

    window.addEventListener("popstate", syncPathname);
    window.addEventListener("wd:navigate", syncPathname);

    return () => {
      window.removeEventListener("popstate", syncPathname);
      window.removeEventListener("wd:navigate", syncPathname);
    };
  }, []);

  const completeMatch = pathname.match(/^\/company\/job-posts\/([^/]+)\/complete$/);
  const detailMatch = pathname.match(/^\/job-posts\/([^/]+)$/);

  if (pathname === routes.login) {
    return <LoginPage />;
  }

  if (pathname === routes.flexibleJobs) {
    return <FlexibleJobsPage />;
  }

  if (pathname === routes.companyDashboard) {
    return <CompanyDashboardPage />;
  }

  if (pathname === routes.jobPostManage) {
    return <JobPostManagePage />;
  }

  if (pathname === "/company/assignments") {
    return <AssignmentPage />;
  }

  if (pathname === "/company/job-posts/new") {
    return <JobPostCreatePage />;
  }

  if (completeMatch) {
    return <JobPostCompletePage jobPostingId={completeMatch[1]} />;
  }

  if (detailMatch) {
    return <JobPostDetailPage jobPostingId={detailMatch[1]} />;
  }

  if (pathname === routes.home) {
    return <MainHomePage />;
  }

  return (
    <PendingRoutePage
      description="요청한 화면은 아직 연결되지 않았습니다."
      href="/company"
      linkLabel="기업 대시보드로 이동"
      title="페이지 준비 중"
    />
  );
}

function MainHomePage() {
  return (
    <div className="wd-page">
      <PublicHeaderNav activePath="/" actionType="login" navType="default" />

      <main className="wd-container">
        <section className="wd-panel wd-hero" aria-labelledby="main-title">
          <div className="wd-hero__main">
            <div className="wd-hero__copy">
              <div>
                <p className="wd-hero-kicker">실력은 full time, 근무는 part time!</p>
                <h1 className="wd-title" id="main-title">
                  <span className="wd-title__line">
                    국내 최초 <span className="wd-title__highlight">유연근무</span>
                  </span>
                  <span className="wd-title__line">전문 매칭 플랫폼 원더독스</span>
                </h1>
                <p className="wd-description">
                  10년의 경력도, 주 3일의 근무도 존중받는 곳.<br />
                  기업과 인재가 각자의 조건에 맞춰 가장 합리적으로 연결됩니다.
                </p>
                <div className="wd-actions">
                  <a className="wd-button wd-button--primary" href={routes.flexibleJobs}>
                    <span className="wd-button__icon wd-icon wd-icon--pin" aria-hidden="true" />
                    유연근무 공고
                  </a>
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

function LoginPage() {
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
                <h2 className="wd-card__title">기업 회원</h2>
              </div>
              <a className="wd-button wd-button--primary" href={routes.companyDashboard}>기업 회원 로그인</a>
            </article>

            <article className="wd-card wd-login-card">
              <span className="wd-login-card__icon wd-icon wd-icon--user" aria-hidden="true" />
              <div>
                <h2 className="wd-card__title">개인 회원</h2>
              </div>
              <a className="wd-button wd-button--secondary" href={routes.flexibleJobs}>개인 회원 로그인</a>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

function PendingRoutePage({ title, description, href, linkLabel }: PendingRoutePageProps) {
  return (
    <div className="wd-company-page">
      <PageContainer>
        <section className="wd-page-heading">
          <h1>{title}</h1>
          <p>{description}</p>
          <p>
            <a href={href}>{linkLabel}</a>
          </p>
        </section>
      </PageContainer>
    </div>
  );
}
