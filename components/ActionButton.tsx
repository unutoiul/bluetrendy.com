"use client";

import Button, { type ButtonProps } from "@mui/material/Button";
import RollText from "./motion/RollText";
import { withTone } from "@/theme/buttonStyles";

type ActionButtonProps = ButtonProps & {
  /** "dark" when the button sits on a dark surface; it restyles the outlined variant to suit. */
  tone?: "light" | "dark";
};

/**
 * The site's button for actions (the counterpart of LinkButton, which navigates): the theme's
 * pill styles, with the label's letters rolling on hover like every other button.
 */
export default function ActionButton({ children, tone = "light", variant, sx, ...props }: ActionButtonProps) {
  return (
    <Button variant={variant} sx={withTone(tone, variant, sx)} {...props}>
      {typeof children === "string" ? <RollText>{children}</RollText> : children}
    </Button>
  );
}
