import { useId } from "react";
import { palette } from "@/theme/palette";

/**
 * The chat button's mark: a speech bubble whose tail cuts away on the same slant as the
 * BlueTrendy B, holding three neurons on a thread. The styles in ChatLauncher animate the
 * neurons like someone typing, and send a spark of current along the thread.
 */
export default function ChatMark() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}-edge`} x1="4" y1="3" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={palette.cyan[25]} />
          <stop offset=".45" stopColor={palette.sky[150]} />
          <stop offset="1" stopColor={palette.blue[350]} />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="6" y1="4" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={palette.sky[150]} stopOpacity=".3" />
          <stop offset="1" stopColor={palette.blue[450]} stopOpacity=".06" />
        </linearGradient>
      </defs>
      {/* The bubble. Its tail is a sharp slanted blade, like the stroke of the B. */}
      <path className="chat-bubble" d="M8.5 4.5h15a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H13.2L5.2 28.3l2.4-6.1A5 5 0 0 1 3.5 17.5v-8a5 5 0 0 1 5-5Z"
        fill={`url(#${id}-glass)`} stroke={`url(#${id}-edge)`} strokeWidth="1.7" strokeLinejoin="round" />
      {/* Three neurons on one thread, with a spark that runs along it. */}
      <path className="chat-thread" d="M10 13.5 C12.5 11.4 13.5 15.6 16 13.5 S19.5 11.4 22 13.5" fill="none"
        stroke={palette.sky[150]} strokeOpacity=".55" strokeWidth="1.1" strokeLinecap="round" />
      <path className="chat-spark" d="M10 13.5 C12.5 11.4 13.5 15.6 16 13.5 S19.5 11.4 22 13.5" fill="none"
        stroke={palette.cyan[25]} strokeWidth="1.6" strokeLinecap="round" pathLength={1} strokeDasharray="0.14 0.86" strokeDashoffset="0.14" />
      <circle className="chat-node" cx="10" cy="13.5" r="2.1" fill={palette.cyan[25]} />
      <circle className="chat-node" cx="16" cy="13.5" r="2.1" fill={palette.cyan[25]} />
      <circle className="chat-node" cx="22" cy="13.5" r="2.1" fill={palette.cyan[25]} />
    </svg>
  );
}
