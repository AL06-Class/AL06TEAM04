import { useEffect, useState } from "react";
import { AssignmentPage } from "./pages/company/AssignmentPage";
import { CompanyDashboardPage } from "./pages/company/CompanyDashboardPage";
import { JobPostCompletePage } from "./pages/company/JobPostCompletePage";
import { JobPostCreatePage } from "./pages/company/JobPostCreatePage";
import { JobPostManagePage } from "./pages/company/JobPostManagePage";
import { FlexibleJobsPage } from "./pages/FlexibleJobsPage";
import { JobPostDetailPage } from "./pages/JobPostDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { MainHomePage } from "./pages/MainHomePage";
import { PendingRoutePage } from "./pages/PendingRoutePage";
import { routes } from "./routes";

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

  return <PendingRoutePage />;
}
