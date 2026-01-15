"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { UserProfile } from "@/helper/types/userData";
import { BASE_URL } from "@/helper/CONST";
import Link from "next/link";
import {
  IconAddProduct,
  IconFavorites,
  IconLogout,
  IconNews,
  IconOrders,
  IconPersonal,
  IconSpecialist,
  IconAddEvent,
  IconCategories,
  IconActivateEvent,
  IconAddBusiness,
  IconShieldCheck,
  IconUsers,
  IconServices,
} from "@/helper/images/icon";
import { refreshUserProfile } from "@/helper/api/viewProfileData";
import { checkToken } from "@/helper/api/checkTocken";
import { useState, useEffect } from "react";
import defaultPhoto from "@/public/images/no-photo-available-icon.jpg";

export const Sidebar = () => {
  const t = useTranslations("profile");
  const router = useRouter();
  const pathname = usePathname();

  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const sidebarItemClass =
    "flex items-center gap-3 w-full p-3 rounded-xl text-sm font-bold transition-all duration-200";

  const activeClass = "bg-blue-600 text-white shadow-md shadow-blue-100";
  const inactiveClass = "text-gray-500 hover:bg-gray-50 hover:text-blue-900";

  const handleLogout = async () => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Failed to notify backend of logout:", error);
      }
    }
    Cookies.remove("accessToken");
    router.push("/login");
    router.refresh();
  };

  // Допоміжна функція для перевірки активності
  const isActive = (path: string) => pathname.includes(path);

  return (
    <aside className="w-full md:w-1/4 lg:w-1/5 p-4 bg-white shadow-sm border border-gray-100 rounded-[32px] h-fit sticky top-28">
      <nav className="flex flex-col h-full">
        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-3">
            <Image
              fill
              src={formData?.avatarUrl || defaultPhoto}
              alt="Avatar"
              loading="eager"
              sizes="96px"
              className="rounded-full object-cover bg-gray-100 border-4 border-white shadow-sm"
            />
          </div>
          <h3 className="font-black text-slate-900 leading-tight">
            {formData?.fullName || t("welcome")}
          </h3>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
            {formData?.role}
          </p>
        </div>

        <div className="space-y-1 grow">
          <Link
            href="/profile/personal"
            className={`${sidebarItemClass} ${
              isActive("/personal") ? activeClass : inactiveClass
            }`}
          >
            <IconPersonal />
            {t("sidebarPersonal")}
          </Link>

          <Link
            href="/profile/favorites"
            className={`${sidebarItemClass} ${
              isActive("/favorites") ? activeClass : inactiveClass
            }`}
          >
            <IconFavorites />
            {t("sidebarFavorites")}
          </Link>

          <Link
            href="/profile/my_orders"
            className={`${sidebarItemClass} ${
              isActive("/my_orders") ? activeClass : inactiveClass
            }`}
          >
            <IconOrders />
            {t("sidebarOrders")}
          </Link>

          <Link
            href="/profile/add_business"
            className={`${sidebarItemClass} ${
              isActive("/add_business") ? activeClass : inactiveClass
            }`}
          >
            <IconAddBusiness />
            {t("sidebarAddBusiness")}
          </Link>

          {(formData?.role === "seller" || formData?.role === "admin") && (
            <>
              <div className="pt-4 pb-2 px-3 text-[10px] font-black text-gray-300 uppercase tracking-[2px]">
                {t("management")}
              </div>
              <Link
                href="/profile/add_product"
                className={`${sidebarItemClass} ${
                  isActive("/add_product") ? activeClass : inactiveClass
                }`}
              >
                <IconAddProduct />
                {t("add_product")}
              </Link>
              <Link
                href="/profile/add_specialist"
                className={`${sidebarItemClass} ${
                  isActive("/add_specialist") ? activeClass : inactiveClass
                }`}
              >
                <IconSpecialist />
                {t("add_specialist")}
              </Link>
              <Link
                href="/profile/add_event"
                className={`${sidebarItemClass} ${
                  isActive("/add_event") ? activeClass : inactiveClass
                }`}
              >
                <IconAddEvent />
                {t("add_event")}
              </Link>
              <Link
                href="/profile/activate_events"
                className={`${sidebarItemClass} ${
                  isActive("/activate_events") ? activeClass : inactiveClass
                }`}
              >
                <IconActivateEvent />
                {t("activate_event")}
              </Link>
            </>
          )}

          {(formData?.role === "seller" || formData?.role === "admin") && (
            <>
              <Link
                href="/profile/add_category"
                className={`${sidebarItemClass} ${
                  isActive("/add_category") ? activeClass : inactiveClass
                }`}
              >
                <IconCategories />
                {t("add_category")}
              </Link>
              <Link
                href="/profile/add_service_category"
                className={`${sidebarItemClass} ${
                  isActive("/add_service_category")
                    ? activeClass
                    : inactiveClass
                }`}
              >
                <IconServices />
                {t("add_service_category")}
              </Link>
            </>
          )}

          {formData?.role === "admin" && (
            <Link
              href="/profile/add_news"
              className={`${sidebarItemClass} ${
                isActive("/add_news") ? activeClass : inactiveClass
              }`}
            >
              <IconNews />
              {t("add_news")}
            </Link>
          )}

          {formData?.role === "admin" && (
            <Link
              href="/profile/user_administration"
              className={`${sidebarItemClass} ${
                isActive("/user_administration") ? activeClass : inactiveClass
              }`}
            >
              <IconUsers />
              {t("user_administration")}
            </Link>
          )}

          {formData?.role === "admin" && (
            <Link
              href="/profile/role_requests"
              className={`${sidebarItemClass} ${
                isActive("/role_requests") ? activeClass : inactiveClass
              }`}
            >
              <IconShieldCheck />
              {t("role_requests")}
            </Link>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-50">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <IconLogout />
            {t("logout")}
          </button>
        </div>
      </nav>
    </aside>
  );
};
