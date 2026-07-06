import { useEffect, useState } from "react";
import { CompanyDashboardPage } from "./pages/company/CompanyDashboardPage";
import { JobPostCompletePage } from "./pages/company/JobPostCompletePage";
import { JobPostManagePage } from "./pages/company/JobPostManagePage";
import { PageContainer } from "./components/common/PageContainer";

type PendingRoutePageProps = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

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

  if (pathname === "/company") {
    return <CompanyDashboardPage />;
  }

  if (pathname === "/company/job-posts") {
    return <JobPostManagePage />;
  }

  if (pathname === "/company/assignments") {
    return (
      <PendingRoutePage
        description="과제 관리 페이지는 현재 다른 협업자가 작업 중입니다."
        href="/company"
        linkLabel="기업 대시보드로 이동"
        title="과제 관리 페이지 준비 중"
      />
    );
  }

  if (pathname === "/company/job-posts/new") {
    return (
      <PendingRoutePage
        description="공고 등록 페이지는 현재 다른 협업자가 작업 중입니다."
        href="/company"
        linkLabel="기업 대시보드로 이동"
        title="공고 등록 페이지 준비 중"
      />
    );
  }

  if (completeMatch) {
    return <JobPostCompletePage jobPostingId={completeMatch[1]} />;
  }

  const detailMatch = pathname.match(/^\/job-posts\/([^/]+)$/);

  if (detailMatch) {
    return (
      <PendingRoutePage
        description="공고 상세 보기 페이지는 현재 다른 협업자가 작업 중입니다."
        href="/company/job-posts"
        linkLabel="공고 관리로 이동"
        title="공고 상세 보기 페이지 준비 중"
      />
    );
  }

  if (pathname === "/") {
    return (
      <PendingRoutePage
        description="메인 홈 화면은 현재 다른 협업자가 작업 중입니다."
        href="/company"
        linkLabel="기업 대시보드로 이동"
        title="메인 홈 준비 중"
      />
    );
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
