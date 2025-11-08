"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navMenu } from "@/helper/CONST";
import { useState } from "react";
import { MenuIcon, XIcon } from "../UI/Icons/icons";

function NavItem({ item, locale, t, pathname }) {
  const [isHovered, setIsHovered] = useState(false);

  const isActive =
    item.path === "/"
      ? pathname.split("/").length < 3
      : pathname.split("/").slice(2).join("").startsWith(item.path);

  return (
    <motion.header whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={`/${locale}/${item.path}`}
        className="px-2 py-1 rounded block"
      >
        <motion.span
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            background: isHovered
              ? [
                  "conic-gradient(from 0deg, #3b82f6, #1e3a8a, #3b82f6)",
                  "conic-gradient(from 360deg, #3b82f6, #1e3a8a, #3b82f6)",
                ]
              : isActive
              ? "#1E3A8A"
              : "linear-gradient(0deg, #f3f4f6, #f3f4f6)",

            color: isActive ? "#FFFFFF" : isHovered ? "#FFFFFF" : "#374151",
          }}
          transition={{
            background: {
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: "linear",
            },
            backgroundColor: { duration: 0.8, ease: "easeInOut" },
            color: { duration: 0.3, ease: "easeInOut" },
          }}
          className="px-2 py-1 rounded block text-center transition-colors"
          style={{ backgroundSize: "200% 200%" }}
        >
          {t(item.key)}
        </motion.span>
      </Link>
    </motion.header>
  );
}

export default function Navbar({ locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow text-gray-700 relative z-30">
      {/* Логотип*/}
      <Link href="/" className="text-[30px] font-bold flex items-center">
        <span className="text-blue-600">UA</span>
        <span className="text-yellow-400">in</span>
        <span className="text-red-600">NL</span>
      </Link>
      <div className="md:flex gap-4 sm:hidden">
        {navMenu.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            locale={locale}
            t={t}
            pathname={pathname}
          />
        ))}
      </div>
      {/* Кнопка мобільного меню */}

      {/* Мобільне меню */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-40 h-screen flex flex-col items-center pt-4 gap-4 justify-center">
          {navMenu.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              locale={locale}
              t={t}
              pathname={pathname}
              onClick={() => setIsMenuOpen(false)}
            />
          ))}
        </div>
      )}
      <LanguageSwitcher locale={locale} />
      <button
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
        type="button"
      >
        {isMenuOpen ? <XIcon /> : <MenuIcon />}
      </button>
    </nav>
  );
}
