import { useId } from "react";

const paths = {
  cube: "M16 2.8 28 9v14l-12 6.2L4 23V9Zm0 12.4L28 9M16 15.2 4 9m12 6.2v14",
  web: "M4 5.5h24v20H4zM4 11h24M8 8.2h1m3 0h1M8 16h5v6H8zm9 0h7m-7 4h5",
  phone: "M11 3h10a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Zm3 3h4m-4 19h4",
  integration: "M3 5h9v8H3zm17 14h9v8h-9zM12 9h8a4 4 0 0 1 4 4v3m-4 7h-8a4 4 0 0 1-4-4v-3m13-3 3 3 3-3m-22 6 3-3 3 3",
  film: "M4 10h24v17H4zM4 10l-1-5 23-3 1 5zM9 4l3 4m4-5 3 4m-6 8v8l7-4z",
  spark: "M14 3c.7 8.6 2.7 11.3 10.5 13-7.8 1.7-9.8 4.4-10.5 13-.7-8.6-2.7-11.3-10.5-13C11.3 14.3 13.3 11.6 14 3Zm11.2-.8c.3 3.4 1.1 4.6 4.4 5.2-3.3.6-4.1 1.8-4.4 5.2-.3-3.4-1.1-4.6-4.4-5.2 3.3-.6 4.1-1.8 4.4-5.2Z",
} as const;

export function ShowcaseGlyph({ kind }: { kind: keyof typeof paths }) {
  const id = useId();
  return <svg viewBox="0 0 32 32" width="32" height="32" fill="none" aria-hidden="true">
    <defs><linearGradient id={id} x1="0%" y1="100%" x2="80%" y2="0%">
      <stop stopColor="#3e86ff" /><stop offset=".53" stopColor="#17ddff" /><stop offset="1" stopColor="#b4faff" />
    </linearGradient></defs>
    <path d={paths[kind]} stroke={`url(#${id})`} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
  </svg>;
}
