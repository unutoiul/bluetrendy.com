"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// The button's own code (its styles, icon and the Crisp bridge) is a separate file that is
// fetched only once the page has loaded. It is never part of the HTML, so nothing to hydrate.
const ChatButton = dynamic(() => import("./ChatButton"), { ssr: false });

/**
 * Brings the live chat button in after the page has loaded and the browser has a quiet
 * moment, so the page itself is never kept waiting for it. The button then rises into place.
 */
export default function ChatLauncher() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle = 0;
    const whenIdle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 300));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    function arm() { idle = whenIdle(() => setReady(true), { timeout: 2500 }); }
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      window.removeEventListener("load", arm);
      cancelIdle(idle);
    };
  }, []);

  return ready ? <ChatButton /> : null;
}
