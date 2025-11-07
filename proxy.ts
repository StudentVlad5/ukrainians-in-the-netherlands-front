import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n"; // Імпортуємо з i18n.ts

export default createMiddleware({
  locales,
  defaultLocale,
});

export const config = {
  // Матчимо всі шляхи, окрім тих, що починаються з:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - будь-яких файлів з розширенням (e.g. .svg, .png, .jpg)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
