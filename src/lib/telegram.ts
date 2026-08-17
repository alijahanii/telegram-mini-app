"use client";

import { useEffect, useState } from "react";

// Minimal shape of the Telegram WebApp SDK we rely on.
// This prepares the app for real Telegram Mini App integration later.
export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  enableClosingConfirmation?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
  };
  MainButton?: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (fn: () => void) => void;
    setText: (text: string) => void;
  };
  initDataUnsafe?: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };
  };
  colorScheme?: "light" | "dark";
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function useTelegramWebApp() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    const app = getTelegramWebApp();
    if (app) {
      app.ready();
      app.expand();
      setWebApp(app);
    }
  }, []);

  return webApp;
}

export function hapticImpact(style: "light" | "medium" | "heavy" = "light") {
  const app = getTelegramWebApp();
  app?.HapticFeedback?.impactOccurred(style);
}

export function hapticNotify(type: "error" | "success" | "warning") {
  const app = getTelegramWebApp();
  app?.HapticFeedback?.notificationOccurred(type);
}
