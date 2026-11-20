/*
 * Crisp live chat, loaded only when a visitor asks for it by pressing our chat button. Until
 * then no Crisp code or cookie reaches the browser. Crisp's own launcher is kept hidden: our
 * button opens the chat, and the chat hides again when it is closed.
 * API: https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/dollar-crisp/
 */

type CrispCommand = unknown[];

declare global {
  interface Window {
    $crisp?: CrispCommand[];
    CRISP_WEBSITE_ID?: string;
    CRISP_RUNTIME_CONFIG?: { locale?: string };
  }
}

export const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID?.trim() ?? "";

type Handlers = {
  onReady: () => void;
  onOpened: () => void;
  onClosed: () => void;
  onMessage: () => void;
};

let started = false;

const push = (...command: CrispCommand) => window.$crisp?.push(command);

/** Loads the chat once, then opens it. Later calls just open it again. */
export function openCrisp(handlers: Handlers) {
  if (started) {
    push("do", "chat:show");
    push("do", "chat:open");
    return;
  }
  started = true;
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = crispWebsiteId;
  window.CRISP_RUNTIME_CONFIG = { locale: "en" };
  push("safe", true);
  push("config", "color:theme", ["blue"]);
  push("do", "chat:hide");
  push("on", "session:loaded", () => {
    handlers.onReady();
    push("do", "chat:show");
    push("do", "chat:open");
  });
  push("on", "chat:opened", handlers.onOpened);
  push("on", "chat:closed", () => {
    // Hide Crisp's own launcher again; our button takes over.
    push("do", "chat:hide");
    handlers.onClosed();
  });
  push("on", "message:received", handlers.onMessage);

  const script = document.createElement("script");
  script.src = "https://client.crisp.chat/l.js";
  script.async = true;
  script.onerror = () => { started = false; };
  document.head.appendChild(script);
}
