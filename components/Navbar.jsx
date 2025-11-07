"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navMenu } from "../helper/CONST";

export default function Navbar({ locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow text-gray-700">
      <div className="flex gap-4">
        {navMenu.map((item) => {
          let isActive;
          if (item.path === "/") {
            isActive = pathname.split("/").length < 3;
          } else {
            isActive = pathname
              .split("/")
              .splice(2)
              .join("")
              .startsWith(item.path);
          }
          return (
            <motion.div
              key={item.key}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                className="px-2 py-1 rounded"
                href={`/${locale}/${item.path}`}
              >
                <motion.span
                  animate={{
                    backgroundColor: isActive ? "#1E3A8A" : "#F3F4F6",
                    color: isActive ? "#FFFFFF" : "#374151",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="px-2 py-1 rounded block"
                >
                  {t(item.key)}
                </motion.span>
              </Link>
            </motion.div>
          );
        })}
      </div>
      <LanguageSwitcher locale={locale} />
    </nav>
  );
}
