import { Placeholder } from "@/components/UI/Placeholder/Placeholder";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations("profile");
  return <Placeholder title={t("ordersTitle")} />;
}
