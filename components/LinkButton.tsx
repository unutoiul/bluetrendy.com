"use client";

import type { MouseEventHandler, ReactNode } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";
import RollText from "./motion/RollText";
import { withTone } from "@/theme/buttonStyles";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  /** "dark" when the button sits on a dark surface; it restyles the outlined variant to suit. */
  tone?: "light" | "dark";
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "inherit";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  prefetch?: boolean;
  className?: string;
  "aria-label"?: string;
  sx?: SxProps<Theme>;
};

/**
 * The site's button for going somewhere (ActionButton is its counterpart for actions): the
 * theme's pill styles, with the label's letters rolling on hover like every other button.
 */
export default function LinkButton({ href, children, tone = "light", sx, ...props }: LinkButtonProps) {
  return (
    <Button component={Link} href={href} sx={withTone(tone, props.variant, sx)} {...props}>
      {typeof children === "string" ? <RollText>{children}</RollText> : children}
    </Button>
  );
}
