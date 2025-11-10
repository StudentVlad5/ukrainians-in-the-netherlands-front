import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

const protectedRoutes = ["/profile", "/admin", "/orders"];
const authRoutes = ["/login", "/register"];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // 1️⃣ Визначаємо поточну локаль (із URL або дефолтну)
  const localeMatch = url.pathname.match(
    new RegExp(`^/(${locales.join("|")})(?=/|$)`)
  );
  const locale = localeMatch ? localeMatch[1] : defaultLocale;

  // 2️⃣ Видаляємо локаль із шляху для перевірок
  const cleanPathname =
    url.pathname.replace(new RegExp(`^/(${locales.join("|")})(?=/|$)`), "") ||
    "/";

  // 3️⃣ Авторизаційна логіка
  const accessToken = request.cookies.get("accessToken")?.value;

  const isProtectedRoute = protectedRoutes.some((path) =>
    cleanPathname.startsWith(path)
  );
  const isAuthRoute = authRoutes.some((path) => cleanPathname.startsWith(path));

  // 🔒 Захищені сторінки
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // 🚪 Якщо користувач уже залогінений
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL(`/${locale}/profile`, request.url));
  }

  // 4️⃣ Тільки тепер викликаємо next-intl для i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
