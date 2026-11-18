"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

type LinkTypographyProps = {
  href: string;
  children: ReactNode;
  variant?: "body1" | "body2" | "subtitle1" | "subtitle2" | "caption" | "overline";
  className?: string;
  sx?: SxProps<Theme>;
};

export default function LinkTypography({ href, children, ...props }: LinkTypographyProps) {
  return (
    <Typography component={Link} href={href} {...props}>
      {children}
    </Typography>
  );
}
