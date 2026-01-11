"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Profile/SideBar/SideBar";
import { UserProfile } from "@/components/Profile/types";
import { refreshUserProfile } from "@/helper/api/viewProfileData";
import { checkToken } from "@/helper/api/checkTocken";
import Cookies from "js-cookie";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
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
          throw new Error("No data");
        }
      } catch (err) {
        console.error("Layout fetch error:", err);
        Cookies.remove("accessToken");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    if (!formData) fetchProfile();
  }, [formData, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="p-4 md:p-10 mt-28 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-start">
        {formData && <Sidebar formData={formData} />}

        <div className="flex-grow w-full transition-all duration-300">
          {children}
        </div>
      </div>
    </section>
  );
}
