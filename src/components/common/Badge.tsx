import type { ReactNode } from "react";

type BadgeTone = "primary" | "success" | "info" | "warning" | "neutral";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  withDot?: boolean;
};

export function Badge({ children, tone = "primary", withDot = false }: BadgeProps) {
  return (
    <span className={`wd-ui-badge wd-ui-badge--${tone}`}>
      {withDot ? <span className="wd-ui-badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
