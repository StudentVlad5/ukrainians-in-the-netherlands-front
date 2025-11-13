import { useTranslations } from "next-intl";
import { UserProfile } from "../types";
import Image from "next/image";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "@/components/UI/Button/Button";
import SelectInput, {
  SelectOption,
} from "@/components/UI/SelectInput/SelectInput";

export const EditProfileForm = ({
  formData,
  avatarFile,
  isSaving,
  isUploading,
  onFormChange,
  onFormSubmit,
  onFileChange,
  onAvatarUpload,
}: {
  formData: Partial<UserProfile>;
  avatarFile: File | null;
  isSaving: boolean;
  isUploading: boolean;
  onFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarUpload: () => void;
}) => {
  const t = useTranslations("profile");

  const statusEnum = ["active", "inactive", "blocked"] as const;
  const statusOptions: SelectOption[] = statusEnum.map((status) => ({
    value: status,
    label: status,
  }));

  const rolesEnum = ["user", "seller", "admin"] as const;
  const rolesOptions: SelectOption[] = rolesEnum.map((role) => ({
    value: role,
    label: role,
  }));

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-blue-950">
        {t("editTitle")}
      </h2>

      <div className="mb-8 p-4 border rounded-md text-gray-700">
        <h3 className="text-lg font-semibold mb-3">{t("avatarTitle")}</h3>
        <div className="flex items-center space-x-4">
          <Image
            width={200}
            height={200}
            src={formData.avatarUrl || "/default-avatar.png"}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover bg-gray-200"
          />
          <div>
            <Input
              id="avatarFile"
              label={t("avatarLabel")}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="mb-2"
            />
            <Button
              onClick={onAvatarUpload}
              isLoading={isUploading}
              disabled={!avatarFile || isUploading}
            >
              {t("avatarButton")}
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={onFormSubmit} className="space-y-6 text-gray-700">
        <Input
          id="email"
          label={t("email")}
          type="email"
          value={formData.email || ""}
          disabled
          readOnly
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="firstName"
            name="firstName"
            label={t("firstName")}
            type="text"
            value={formData.firstName || ""}
            onChange={onFormChange}
            disabled={isSaving}
          />
          <Input
            id="lastName"
            name="lastName"
            label={t("lastName")}
            type="text"
            value={formData.lastName || ""}
            onChange={onFormChange}
            disabled={isSaving}
          />
        </div>
        <Input
          id="city"
          name="city"
          label={t("city")}
          type="text"
          value={formData.city || ""}
          onChange={onFormChange}
          disabled={isSaving}
        />
        <Input
          id="phone"
          name="phone"
          label={t("phone")}
          type="tel"
          value={formData.phone || ""}
          onChange={onFormChange}
          disabled={isSaving}
        />
        {(formData.role === "admin" || formData.role === "saler") && (
          <>
            <Input
              id="website"
              name="website"
              label={t("website")}
              type="text"
              value={formData.contact?.website || ""}
              onChange={onFormChange}
              disabled={isSaving}
            />
            <Input
              id="facebook"
              name="facebook"
              label={t("facebook")}
              type="text"
              value={formData.contact?.facebook || ""}
              onChange={onFormChange}
              disabled={isSaving}
            />
            <Input
              id="linkedin"
              name="linkedin"
              label={t("linkedin")}
              type="text"
              value={formData.contact?.linkedin || ""}
              onChange={onFormChange}
              disabled={isSaving}
            />
            <SelectInput
              label={t("status")}
              name="status"
              value={formData.status || ""} //
              onChange={onFormChange}
              disabled={isSaving}
              options={statusOptions}
              placeholder={formData.status}
            />
          </>
        )}
        {formData.role === "admin" && (
          <>
            <SelectInput
              label={t("role")}
              name="role"
              value={formData.role || ""} //
              onChange={onFormChange}
              disabled={isSaving}
              options={rolesOptions}
              placeholder={formData.role}
            />
          </>
        )}
        <Button type="submit" isLoading={isSaving} disabled={isSaving}>
          {t("saveButton")}
        </Button>
      </form>
    </div>
  );
};
