"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import type { MenuProps } from "@mui/material/Menu";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import styles from "./Dropdown.styles";

export type DropdownOption = {
  value: string;
  label: string;
  /** Secondary text at the end of the row, such as a count. */
  hint?: ReactNode;
  /** Draws a hairline under the option, to set apart a choice like "All industries". */
  separated?: boolean;
};

type DropdownProps = {
  value: string;
  options: readonly (string | DropdownOption)[];
  onChange: (value: string) => void;
  /** A visible label makes an outlined form field. Without one the dropdown is a compact pill. */
  label?: string;
  "aria-label"?: string;
  name?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  /** The edge of the trigger the list lines up with. */
  align?: "start" | "end";
};

// Scrolling the page this far closes an open list, as a native select does.
const scrollTolerance = 32;

/** The one dropdown used across the site, so every list opens, looks and behaves the same. */
export default function Dropdown({
  value, options, onChange, label, "aria-label": ariaLabel, name, disabled, fullWidth, align = "start",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const triggerId = useId();
  const wasOpen = useRef(false);
  const items = options.map(option => typeof option === "string" ? { value: option, label: option } : option);

  useEffect(() => {
    if (!open) {
      // MUI's own focus return would scroll the page back to the trigger, so it is done here without scrolling.
      if (wasOpen.current) document.getElementById(triggerId)?.focus({ preventScroll: true });
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    // The page keeps scrolling while the list is open, so close it rather than leave it floating.
    const start = window.scrollY;
    const closeOnScroll = () => {
      if (Math.abs(window.scrollY - start) > scrollTolerance) setOpen(false);
    };
    window.addEventListener("scroll", closeOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", closeOnScroll);
  }, [open, triggerId]);

  const edge = align === "end" ? "right" : "left";
  const menuProps: Partial<MenuProps> = {
    disableRestoreFocus: true,
    anchorOrigin: { vertical: "bottom", horizontal: edge },
    transformOrigin: { vertical: "top", horizontal: edge },
  };
  const shared = {
    open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    IconComponent: KeyboardArrowDownRounded,
    MenuProps: menuProps,
    SelectDisplayProps: { id: triggerId },
    renderValue: (selected: unknown) => items.find(item => item.value === selected)?.label,
  };
  const menuItems = items.map(item => (
    <MenuItem key={item.value} value={item.value} divider={item.separated}>
      {item.label}
      {item.hint != null && <span className={styles.hint} aria-hidden="true">{item.hint}</span>}
    </MenuItem>
  ));

  if (label) {
    return (
      <TextField select label={label} name={name} value={value} disabled={disabled} fullWidth={fullWidth}
        onChange={event => onChange(event.target.value)} slotProps={{ select: shared }}>
        {menuItems}
      </TextField>
    );
  }
  return (
    <Select {...shared} variant="standard" displayEmpty name={name} value={value} disabled={disabled}
      fullWidth={fullWidth} onChange={event => onChange(event.target.value)}
      input={<InputBase className={styles.pill} />} inputProps={{ "aria-label": ariaLabel }}>
      {menuItems}
    </Select>
  );
}
