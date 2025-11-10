"use client";
import { useTranslations } from "next-intl";

export default function NewsPage() {
  const t = useTranslations("news");

  return (
    <section className="p-10 text-center">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-lg mt-2">{t("subtitle")}</p>
    </section>
  );
}
