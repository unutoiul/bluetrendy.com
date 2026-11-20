/*
 * Crisp live chat, loaded only when a visitor asks for it by pressing our chat button. Until
 * then no Crisp code or cookie reaches the browser.
 *
 * Our button is the only launcher. It sits exactly over Crisp's own button, above it in the
 * stacking order, and toggles the chat; Crisp's button is hidden with CSS (see ChatLauncher).
 * Crisp's window keeps its own open and close animation, so both directions look the same.
 * API: https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/dollar-crisp/
 */

type CrispCommand = unknown[];

declare global {
  interface Window {
    $crisp?: CrispCommand[] & { is?: (state: string) => boolean };
    CRISP_WEBSITE_ID?: string;
    CRISP_RUNTIME_CONFIG?: { locale?: string };
  }
}

export const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID?.trim() ?? "";

/**
 * Where Crisp draws its own button: 54px square, 24px from the right and 20px from the bottom
 * of the window (measured, not documented). Our button is centred on the same point.
 */
export const crispLauncher = { size: 54, right: 24, bottom: 20 };

/** Crisp sits above the header (1100) and below our button (1240) and the cookie banner (1250). */
export const crispLayer = 1235;

type Handlers = {
  onReady: () => void;
  onOpened: () => void;
  onClosed: () => void;
  onMessage: () => void;
};

// The button that should hear about the chat. Kept current, so Crisp's callbacks, which are
// registered once, always reach the button on screen.
let current: Handlers | null = null;

const push = (...command: CrispCommand) => window.$crisp?.push(command);

/** On a phone Crisp can take the whole screen, with its own close button in the header. */
export function crispTakesScreen() {
  const box = document.getElementById("crisp-chatbox");
  return box?.dataset.mobileView === "true" || box?.dataset.fullView === "true";
}

/** Whether Crisp's window is open. False until Crisp has loaded. */
export function crispIsOpen() {
  try {
    return window.$crisp?.is?.("chat:opened") === true;
  } catch {
    return false;
  }
}

/** Loads the chat on the first call, then opens it. */
export function openCrisp(handlers: Handlers) {
  current = handlers;
  // Crisp may already be on the page (loaded earlier in this visit): just open it.
  if (window.$crisp) {
    push("do", "chat:open");
    return;
  }
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = crispWebsiteId;
  window.CRISP_RUNTIME_CONFIG = { locale: "en" };
  push("safe", true);
  push("config", "color:theme", ["blue"]);
  push("config", "container:index", [crispLayer]);
  // Opened only once Crisp is ready: an open queued during start-up doesn't send "chat:opened".
  push("on", "session:loaded", () => {
    current?.onReady();
    push("do", "chat:open");
    // A window Crisp restores from an earlier visit opens without the event, so also watch
    // its state for a moment and report the opening as soon as it shows.
    const begun = performance.now();
    const watch = window.setInterval(() => {
      if (crispIsOpen()) current?.onOpened();
      if (crispIsOpen() || performance.now() - begun > 2000) window.clearInterval(watch);
    }, 50);
  });
  push("on", "chat:opened", () => current?.onOpened());
  push("on", "chat:closed", () => current?.onClosed());
  push("on", "message:received", () => current?.onMessage());

  const script = document.createElement("script");
  script.src = "https://client.crisp.chat/l.js";
  script.async = true;
  // Blocked or offline: forget the queue, so the next press tries again.
  script.onerror = () => { delete window.$crisp; script.remove(); };
  document.head.appendChild(script);
}

export function closeCrisp() {
  push("do", "chat:close");
}
