# TeleShop Telegram Mini App

این نسخه برای اجرای پروژه داخل Telegram Mini App آماده شده است.

## تنظیمات محیطی

در `.env.local` این متغیرها را تنظیم کنید:

```env
DATABASE_URL=postgresql://...
TELEGRAM_BOT_TOKEN=توکن_ربات_از_BotFather
```

## اجرا

```bash
npm install
npm run dev
```

برای اجرای Mini App واقعی، پروژه باید روی یک دامنه HTTPS عمومی deploy شود.

## اتصال به BotFather

1. در `@BotFather` ربات را بسازید و Bot Token را در `TELEGRAM_BOT_TOKEN` قرار دهید.
2. یک Web App / Mini App برای ربات تعریف کنید.
3. URL نسخه deploy شده را به عنوان Web App URL قرار دهید.
4. ربات را باز کنید و Mini App را اجرا کنید.

## احراز هویت

پروژه `Telegram WebApp initData` را در `/api/telegram/auth` با Bot Token اعتبارسنجی می‌کند و کاربر را در جدول `users` ایجاد/به‌روزرسانی می‌کند.

**مهم:** `initDataUnsafe` برای احراز هویت سمت سرور استفاده نمی‌شود؛ مقدار `initData` باید روی سرور اعتبارسنجی شود.
