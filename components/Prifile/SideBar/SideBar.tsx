import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { SidebarButton } from "../../UI/SidebarButton/SidebarButtun";
import { UserProfile, ActiveTab } from "../types";
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
} from "@/helper/images/icon";

export const Sidebar = ({
  formData,
  activeTab,
  setActiveTab,
}: {
  formData: UserProfile;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}) => {
  const t = useTranslations("profile");
  const router = useRouter();
  const sidebarItemClass =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-3 w-full p-3 rounded-md text-sm font-medium transition-colors duration-200";

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

  return (
    <aside className="w-full md:w-1/4 lg:w-1/5 p-4 bg-white shadow-md rounded-lg">
      <nav className="flex flex-col h-full">
        {/* Секція з аватаркою вгорі сайдбару */}
        <div className="text-center mb-6">
          <Image
            width={200}
            height={200}
            src={formData.avatarUrl || "/default-avatar.png"}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover bg-gray-200 mx-auto mb-2"
          />
          <h3 className="font-semibold text-blue-950">
            {formData.fullName || t("welcome")}
          </h3>
        </div>

        {/* Навігація */}
        <div className="space-y-2 grow">
          <SidebarButton
            label={t("sidebarPersonal")}
            icon={<IconPersonal />}
            isActive={activeTab === "personal" || activeTab === "edit"}
            onClick={() => setActiveTab("personal")}
          />

          <SidebarButton
            label={t("sidebarFavorites")}
            icon={<IconFavorites />}
            isActive={activeTab === "favorites"}
            onClick={() => setActiveTab("favorites")}
          />

          <SidebarButton
            label={t("sidebarOrders")}
            icon={<IconOrders />}
            isActive={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          />

          {(formData.role === "seller" || formData.role === "admin") && (
            <Link href="/add_product" className={sidebarItemClass}>
              <IconAddProduct />
              {t("add_product")}
            </Link>
          )}

          {(formData.role === "seller" || formData.role === "admin") && (
            <Link href="/add_specialist" className={sidebarItemClass}>
              <IconSpecialist />
              {t("add_specialist")}
            </Link>
          )}

          {(formData.role === "seller" || formData.role === "admin") && (
            <Link href="/add_event" className={sidebarItemClass}>
              <IconAddEvent />
              {t("add_event")}
            </Link>
          )}

          {(formData.role === "seller" || formData.role === "admin") && (
            <Link href="/activate_events" className={sidebarItemClass}>
              <IconActivateEvent />
              {t("activate_event")}
            </Link>
          )}

          {(formData.role === "seller" || formData.role === "admin") && (
            <Link href="/add_category" className={sidebarItemClass}>
              <IconCategories />
              {t("add_category")}
            </Link>
          )}

          {formData.role === "admin" && (
            <Link href="/add_news" className={sidebarItemClass}>
              <IconNews />
              {t("add_news")}
            </Link>
          )}
        </div>

        {/* Кнопка Виходу внизу */}
        <div className="mt-auto">
          <SidebarButton
            label={t("logout")}
            icon={<IconLogout />}
            isActive={false}
            onClick={handleLogout}
            isLogout
          />
        </div>
      </nav>
    </aside>
  );
};
