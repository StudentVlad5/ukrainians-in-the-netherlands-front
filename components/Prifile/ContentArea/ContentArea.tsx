import { useState } from "react";
import { Placeholder } from "@/components/UI/Placeholder/Placeholder";
import { EditProfileForm } from "../EditProfileForm/EditProfileForm";
import { ViewProfileData } from "../ViewProfileData/ViewProfileData";
import { useTranslations } from "next-intl";
import type { Dispatch, SetStateAction, ChangeEvent, FormEvent } from "react";
import {
  updateUserProfile,
  uploadUserAvatar,
} from "@/helper/api/viewProfileData";
import { checkTokenWithStay } from "@/helper/api/checkTocken";
import { onSuccess } from "@/lib/Messages/NotifyMessages";
import { ActiveTab, UserProfile } from "@/components/Prifile/types";

type ContentAreaProps = {
  error: string;
  activeTab: ActiveTab;
  formData: Partial<UserProfile>;
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>;
  avatarFile: File | null;
  setFormData: Dispatch<SetStateAction<Partial<UserProfile>>>;
  setAvatarFile: Dispatch<SetStateAction<File | null>>;
  setError: Dispatch<SetStateAction<string>>;
};

export const ContentArea = ({
  error,
  activeTab,
  formData,
  setActiveTab,
  avatarFile,
  setFormData,
  setAvatarFile,
  setError,
}: ContentAreaProps) => {
  const t = useTranslations("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (["website", "linkedin", "facebook"].includes(name)) {
      setFormData((prev: Partial<UserProfile>) => ({
        ...prev,
        contacts: {
          ...prev.contacts,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev: Partial<UserProfile>) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    const token = checkTokenWithStay();
    try {
      const data = await updateUserProfile(formData, token);
      setFormData(data);
      setActiveTab("personal");
      onSuccess(t("saveSuccess"));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setIsUploading(true);
    setError("");
    const token = checkTokenWithStay();
    try {
      const data = await uploadUserAvatar(avatarFile, token);
      setFormData((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
      setAvatarFile(null);
      onSuccess(t("avatarSuccess"));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <main className="w-full md:w-3/4 lg:w-4/5 md:pl-6">
      <div className="bg-white shadow-md rounded-lg p-6 min-h-[400px]">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {activeTab === "personal" && (
          <ViewProfileData
            user={formData}
            onEditClick={() => setActiveTab("edit")}
          />
        )}

        {activeTab === "edit" && (
          <EditProfileForm
            formData={formData}
            avatarFile={avatarFile}
            isSaving={isSaving}
            isUploading={isUploading}
            onFormChange={handleChange}
            onFormSubmit={handleProfileSave}
            onFileChange={handleFileChange}
            onAvatarUpload={handleAvatarUpload}
          />
        )}

        {activeTab === "favorites" && (
          <Placeholder title={t("favoritesTitle")} />
        )}

        {activeTab === "orders" && <Placeholder title={t("ordersTitle")} />}
      </div>
    </main>
  );
};
