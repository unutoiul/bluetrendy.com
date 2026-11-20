"use client";

import { useEffect } from "react";
import { rememberArrival } from "@/lib/attribution";

/** Notes how the visit began, once, so an enquiry sent later can say where it came from. Renders nothing. */
export default function Arrival() {
  useEffect(() => { rememberArrival(); }, []);
  return null;
}
