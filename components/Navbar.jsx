"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ locale }) {
  const t = useTranslations("nav");

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <div className="flex gap-4">
        <Link href={`/${locale}`}>{t("home")}</Link>
        <Link href={`/${locale}/listings`}>{t("listings")}</Link>
        <Link href={`/${locale}/profile`}>{t("profile")}</Link>
      </div>
      <LanguageSwitcher locale={locale} />
    </nav>
  );
}
