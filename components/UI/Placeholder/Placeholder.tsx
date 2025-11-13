import { useTranslations } from "next-intl";

export const Placeholder = ({ title }: { title: string }) => {
  const t = useTranslations("profile");
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-blue-950">{title}</h2>
      <p className="text-gray-500">{t("workInProgress")}</p>
    </div>
  );
};
