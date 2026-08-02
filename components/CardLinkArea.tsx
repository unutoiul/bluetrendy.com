"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import CardActionArea from "@mui/material/CardActionArea";
import type { SxProps, Theme } from "@mui/material/styles";

type CardLinkAreaProps = {
  href: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
};

export default function CardLinkArea({ href, children, ...props }: CardLinkAreaProps) {
  return (
    <CardActionArea component={Link} href={href} {...props}>
      {children}
    </CardActionArea>
  );
}
