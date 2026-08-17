import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Vazirmatn } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";
import { TelegramMiniAppProvider } from "@/components/telegram/TelegramMiniAppProvider";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TeleShop | فروشگاه خدمات تلگرام",
  description: "مارکت‌پلیس پرمیوم خدمات تلگرام: تبلیغات کانال، Premium، Stars، Gift و استیکر",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#05070c",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-dvh bg-[#05070c] font-sans text-white antialiased" style={{ fontFamily: "var(--font-vazirmatn), sans-serif" }}>
        <TelegramMiniAppProvider />
        {children}
        <Toaster
          position="top-center"
          dir="rtl"
          toastOptions={{
            style: {
              background: "#12161f",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "var(--font-vazirmatn), sans-serif",
              borderRadius: "16px",
            },
          }}
        />
      </body>
    </html>
  );
}
