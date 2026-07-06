import { CompanyDashboardPage } from "./pages/company/CompanyDashboardPage";
import { JobPostCompletePage } from "./pages/company/JobPostCompletePage";
import { JobPostManagePage } from "./pages/company/JobPostManagePage";

export default function App() {
  const pathname = window.location.pathname;
  const completeMatch = pathname.match(/^\/company\/job-posts\/([^/]+)\/complete$/);

  if (pathname === "/company") {
    return <CompanyDashboardPage />;
  }

  if (pathname === "/company/job-posts") {
    return <JobPostManagePage />;
  }

  if (completeMatch) {
    return <JobPostCompletePage jobPostingId={completeMatch[1]} />;
  }

  return <CompanyDashboardPage />;
}
