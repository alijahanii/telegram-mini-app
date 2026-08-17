"use client";

import { useEffect } from "react";
import { getTelegramWebApp } from "@/lib/telegram";

export function TelegramMiniAppProvider() {
  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (!webApp) return;

    webApp.ready();
    webApp.expand();
    webApp.setHeaderColor?.("#05070c");
    webApp.setBackgroundColor?.("#05070c");

    // Authenticate the Mini App once. The server verifies Telegram's initData
    // before creating the session cookie.
    const initData = (webApp as any).initData as string | undefined;
    if (initData) {
      fetch("/api/telegram/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
        credentials: "include",
      }).catch(() => {
        // The UI can still load if authentication is temporarily unavailable.
      });
    }
  }, []);

  return null;
}
