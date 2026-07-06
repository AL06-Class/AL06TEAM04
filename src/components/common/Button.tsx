import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "large" | "medium" | "small";

type CommonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  fullWidth?: boolean;
};

type LinkButtonProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ActionButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

function getClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  className?: string
) {
  return [
    "wd-ui-button",
    `wd-ui-button--${variant}`,
    `wd-ui-button--${size}`,
    fullWidth ? "wd-ui-button--full" : "",
    className ?? ""
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: LinkButtonProps | ActionButtonProps) {
  if ("href" in props && props.href) {
    const linkProps = props as LinkButtonProps;
    const {
      children,
      href,
      variant = "primary",
      size = "medium",
      fullWidth = false,
      className,
      ...rest
    } = linkProps;

    return (
      <a
        className={getClassName(variant, size, fullWidth, className)}
        href={href}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const buttonProps = props as ActionButtonProps;
  const {
    children,
    variant = "primary",
    size = "medium",
    fullWidth = false,
    className,
    type,
    ...rest
  } = buttonProps;

  const buttonType = type === "submit" || type === "reset" || type === "button" ? type : "button";

  return (
    <button
      className={getClassName(variant, size, fullWidth, className)}
      type={buttonType}
      {...rest}
    >
      {children}
    </button>
  );
}
