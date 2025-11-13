"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Placeholder } from "@/components/UI/Placeholder/Placeholder";
import { Sidebar } from "@/components/Prifile/SideBar/SideBar";
import { EditProfileForm } from "@/components/Prifile/EditProfileForm/EditProfileForm";
import { ActiveTab, UserProfile } from "@/components/Prifile/types";
import { ViewProfileData } from "@/components/Prifile/ViewProfileData/ViewProfileData";
import {
  refreshUserProfile,
  updateUserProfile,
  uploadUserAvatar,
} from "@/helper/api/viewProfileData";
import { checkToken, checkTokenWithStay } from "@/helper/api/checkTocken";
import { onSuccess } from "@/lib/Messages/NotifyMessages";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ActiveTab>("personal");
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = checkToken(router);

      try {
        const data = await refreshUserProfile(token);
        setFormData(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
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

  if (isLoading) {
    return <section className="p-10 text-center">{t("loading")}</section>;
  }

  const ContentArea = () => (
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

  return (
    <section className="p-4 md:p-10 bg-gray-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 ">
        <Sidebar
          formData={formData as UserProfile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <ContentArea />
      </div>
    </section>
  );
}
