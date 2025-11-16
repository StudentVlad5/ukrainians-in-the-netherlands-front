import { useTranslations } from "next-intl";
import { UserProfile } from "../types";
import { Button } from "@/components/UI/Button/Button";

export const ViewProfileData = ({
  user,
  onEditClick,
}: {
  user: Partial<UserProfile>;
  onEditClick: () => void;
}) => {
  const t = useTranslations("profile");
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-950">
          {t("sidebarPersonal")}
        </h2>
      </div>
      <div className="space-y-4">
        <InfoRow label={t("fullName")} value={user.fullName || t("notSet")} />
        <InfoRow label={t("email")} value={user.email || t("notSet")} />
        <InfoRow label={t("phone")} value={user.phone || t("notSet")} />
        <InfoRow label={t("city")} value={user.city || t("notSet")} />
        {(user.role === "saller" || user.role === "admin") && (
          <InfoRow label={t("status")} value={user.status || t("notSet")} />
        )}
        {(user.role === "saller" || user.role === "admin") && (
          <>
            <InfoRow
              label={t("website")}
              value={user.contacts?.website || t("notSet")}
            />
            <InfoRow
              label={t("linkedin")}
              value={user.contacts?.linkedin || t("notSet")}
            />
            <InfoRow
              label={t("facebook")}
              value={user.contacts?.facebook || t("notSet")}
            />
          </>
        )}
        {user.role === "admin" && (
          <InfoRow label={t("role")} value={user.role || t("notSet")} />
        )}
      </div>
      <Button onClick={onEditClick}>{t("editButton")}</Button>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col md:flex-row w-full py-2 border-b mb-4">
    <dl className="flex flex-col md:flex-row w-full my-2">
      <dt className="w-full md:w-1/3 font-medium text-gray-500">{label}</dt>
      <dd className="w-full md:w-2/3 text-gray-900">{value}</dd>
    </dl>
  </div>
);
