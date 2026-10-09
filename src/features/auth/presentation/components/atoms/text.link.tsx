import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router";

type TextLinkProps = {
  children: ReactNode;
  to?: string;
  className?: string;
  onClick?: () => void;
};

export function TextLink({
  children,
  to,
  className = "",
  onClick,
}: TextLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    if (!to) {
      event.preventDefault();
    }

    onClick?.();
  }

  return (
    <Link
      className={`auth link ${className}`.trim()}
      to={to ?? "#"}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
