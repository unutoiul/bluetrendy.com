import Box from "@mui/material/Box";
import ScienceOutlined from "@mui/icons-material/ScienceOutlined";
import type { SxProps, Theme } from "@mui/material/styles";
import { lab } from "./labStyle";

type SampleBadgeProps = {
  children?: string;
  /** The surface the badge sits on. */
  tone?: "dark" | "light";
  sx?: SxProps<Theme>;
};

/**
 * Marks a demonstration as a demonstration. Every example screen, sample business and
 * illustrative figure on the site carries one, so nothing invented reads as a client result.
 */
export default function SampleBadge({ children = "Illustrative example · sample data", tone = "dark", sx }: SampleBadgeProps) {
  return (
    <Box component="span" sx={[lab.sample(tone), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>}>
      <ScienceOutlined aria-hidden="true" />{children}
    </Box>
  );
}
