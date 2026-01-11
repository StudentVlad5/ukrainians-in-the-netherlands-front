"use client";

import { useTranslations } from "next-intl";
import { Placeholder } from "@/components/UI/Placeholder/Placeholder";

export default function ProfilePage() {
  const t = useTranslations("profile");

  // if (isLoading) {
  //   return <section className="p-10 text-center">{t("loading")}</section>;
  // }

  return <Placeholder title={t("favoritesTitle")} />;
}
