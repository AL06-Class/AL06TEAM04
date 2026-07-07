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
      onClick,
      ...rest
    } = linkProps;

    const handleClick: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"] = (event) => {
      onClick?.(event);

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
      <a
        className={getClassName(variant, size, fullWidth, className)}
        href={href}
        onClick={handleClick}
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
