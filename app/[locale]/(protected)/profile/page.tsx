"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Prifile/SideBar/SideBar";
import { ActiveTab, UserProfile } from "@/components/Prifile/types";
import { refreshUserProfile } from "@/helper/api/viewProfileData";
import { checkToken } from "@/helper/api/checkTocken";
import { ContentArea } from "@/components/Prifile/ContentArea/ContentArea";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ActiveTab>("personal");
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    contacts: {
      website: "",
      linkedin: "",
      facebook: "",
    },
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <section className="p-10 text-center">{t("loading")}</section>;
  }

  return (
    <section className="p-4 md:p-10 bg-gray-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 ">
        <Sidebar
          formData={formData as UserProfile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <ContentArea
          error={error}
          activeTab={activeTab}
          formData={formData}
          setActiveTab={setActiveTab}
          avatarFile={avatarFile}
          setFormData={setFormData}
          setAvatarFile={setAvatarFile}
          setError={setError}
        />
      </div>
    </section>
  );
}
