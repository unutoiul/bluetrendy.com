"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";
import RollText from "./motion/RollText";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "inherit";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  sx?: SxProps<Theme>;
};

export default function LinkButton({ href, children, ...props }: LinkButtonProps) {
  return (
    <Button component={Link} href={href} {...props}>
      {typeof children === "string" ? <RollText>{children}</RollText> : children}
    </Button>
  );
}
