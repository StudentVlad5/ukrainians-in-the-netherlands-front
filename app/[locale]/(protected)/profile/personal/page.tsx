"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ActiveTab, UserProfile } from "@/helper/types/userData";
import { refreshUserProfile } from "@/helper/api/viewProfileData";
import { checkToken } from "@/helper/api/checkTocken";
import { ContentArea } from "@/components/Profile/ContentArea/ContentArea";
import Cookies from "js-cookie";

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
    const handleAuthError = () => {
      Cookies.remove("accessToken");
      router.push("/login");
    };

    const fetchProfile = async () => {
      setIsLoading(true);
      const token = checkToken(router);
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const data = await refreshUserProfile(token);
        if (data) {
          setFormData(data);
        } else {
          router.push("/login");
          handleAuthError();
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        handleAuthError();
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (isLoading) {
    return <div className="p-10 text-center">{t("loading")}</div>;
  }

  return (
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
  );
}
