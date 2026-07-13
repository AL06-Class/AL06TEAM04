import type { MouseEvent } from "react";
import wonderdogsLogo from "../../assets/wonderdogs-logo.png";

type PublicHeaderNavProps = {
  activePath: "/" | "/login" | "/flexible-jobs";
  memberLabel?: string;
  actionType?: "member" | "login";
  navType?: "default" | "member";
};

const defaultMenuItems = [
  { label: "유연근무 공고", href: "/flexible-jobs" },
  { label: "경력자 찾기", href: "/login" },
  { label: "채용 도우미", href: "/login" },
  { label: "이용 안내", href: "/login" },
  { label: "고객센터", href: "/login" }
] as const;

const memberMenuItems = [
  { label: "유연근무 공고", href: "/flexible-jobs" },
  { label: "이력서 관리", href: "#", disabled: true },
  { label: "지원 현황", href: "#", disabled: true }
] as const;

export function PublicHeaderNav({
  activePath,
  memberLabel = "개인 회원(이원서님)",
  actionType = "member",
  navType = "default"
}: PublicHeaderNavProps) {
  const menuItems = navType === "member" ? memberMenuItems : defaultMenuItems;

  const handleNavigate = (href: string, disabled?: boolean) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    if (
      event.defaultPrevented ||
      !href.startsWith("/") ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    window.history.pushState({}, "", href);
    window.dispatchEvent(new Event("wd:navigate"));
  };

  return (
    <header className="wd-public-header">
      <div className="wd-public-header__inner">
        <a className="wd-public-header__logo" href="/" aria-label="WONDERDOGs 홈" onClick={handleNavigate("/")}>
          <img src={wonderdogsLogo} alt="WONDERDOGs" />
        </a>

        <nav className="wd-public-header__nav" aria-label="상단 메뉴">
          {menuItems.map((item) => (
            <a
              className={`wd-public-header__nav-link ${
                navType === "member" && activePath === item.href ? "is-active" : ""
              }`}
              href={item.href}
              key={item.label}
              onClick={handleNavigate(item.href, "disabled" in item ? item.disabled : false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {actionType === "login" ? (
          <a className="wd-button wd-button--primary wd-button--compact" href="/login" onClick={handleNavigate("/login")}>
            <span className="wd-button__icon wd-icon wd-icon--user" aria-hidden="true" />
            로그인
          </a>
        ) : (
          <a className="wd-public-header__member" href="/flexible-jobs" onClick={handleNavigate("/flexible-jobs")}>
            <span className="wd-public-header__member-icon" aria-hidden="true" />
            {memberLabel}
            <span className="wd-public-header__member-caret" aria-hidden="true" />
          </a>
        )}
      </div>
    </header>
  );
}
