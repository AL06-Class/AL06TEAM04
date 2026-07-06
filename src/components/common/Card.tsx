import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  soft?: boolean;
};

export function Card({ children, className, soft = false, ...rest }: CardProps) {
  const mergedClassName = ["wd-ui-card", soft ? "wd-ui-card--soft" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={mergedClassName} {...rest}>
      {children}
    </div>
  );
}
