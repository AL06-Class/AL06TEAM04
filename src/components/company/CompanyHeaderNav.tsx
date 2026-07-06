import wonderdogsLogo from "../../assets/wonderdogs-logo.png";

type CompanyHeaderNavProps = {
  activePath: "/company" | "/company/job-posts" | "/company/job-posts/complete";
};

const menuItems = [
  { label: "경력자 찾기", href: "#" },
  { label: "공고 관리", href: "/company/job-posts" },
  { label: "과제 관리", href: "#" },
  { label: "지원자 관리", href: "#" },
  { label: "유연근무 공고", href: "#" }
] as const;

export function CompanyHeaderNav({ activePath }: CompanyHeaderNavProps) {
  return (
    <header className="wd-company-header">
      <div className="wd-company-header__inner">
        <a className="wd-company-header__logo" href="/company" aria-label="WONDERDOGs 기업 대시보드">
          <img src={wonderdogsLogo} alt="WONDERDOGs" />
        </a>

        <nav className="wd-company-header__nav" aria-label="기업 메뉴">
          {menuItems.map((item) => {
            const isActive =
              (activePath === "/company/job-posts/complete" && item.href === "/company/job-posts") ||
              activePath === item.href;

            return (
              <a
                className={`wd-company-header__nav-link ${isActive ? "is-active" : ""}`}
                href={item.href}
                key={item.label}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <button className="wd-company-header__member" type="button">
          <span className="wd-company-header__member-icon" aria-hidden="true" />
          원더독스 기업 회원
          <span className="wd-company-header__member-caret" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
