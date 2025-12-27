"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navMenu } from "@/helper/CONST";
import { useState, useEffect } from "react";
import { MenuIcon, XIcon } from "../UI/Icons/icons";

function NavItem({ item, locale, t, pathname, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const itemPath = item.path.startsWith("/") ? item.path : `/${item.path}`;

  const segments = pathname.split("/");
  const pathnameWithoutLocale = `/${segments.slice(2).join("/")}` || "/";

  const normalizedPathname =
    pathname === `/${locale}` || pathname === `/${locale}/`
      ? "/"
      : pathnameWithoutLocale;

  //  Прибираємо локаль із pathname через RegExp
  const isActive =
    itemPath === "/"
      ? normalizedPathname === "/"
      : normalizedPathname.startsWith(itemPath);

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={`/${locale}${
          item.path.startsWith("/") ? item.path : `/${item.path}`
        }`}
        onClick={onClick}
        className="w-full text-center"
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
            color: isActive ? "#FFFFFF" : isHovered ? "#FFFFFF" : "#1F2937",
          }}
          transition={{
            background: {
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: "linear",
            },
            color: { duration: 0.3, ease: "easeInOut" },
          }}
          className="px-6 py-3 rounded-lg block text-lg font-medium transition-all"
          style={{
            backgroundSize: "200% 200%",
            boxShadow: isHovered ? "0 0 10px rgba(59, 130, 246, 0.4)" : "none",
          }}
        >
          {t(item.key)}
        </motion.span>
      </Link>
    </motion.div>
  );
}

export default function Navbar({ locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow text-gray-700 fixed z-30 w-full mx-auto top-0">
      {/* Логотип */}
      <Link href="/" className="text-[30px] font-bold flex items-center">
        <span className="text-blue-600">UA</span>
        <span className="text-yellow-400">in</span>
        <span className="text-red-600">NL</span>
      </Link>

      {/* Десктоп-меню */}
      <div className="lg:flex gap-4 hidden">
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

      {/* Мобільне меню з анімацією */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-white/95 backdrop-blur-md shadow-lg z-40 flex flex-col items-center justify-center gap-6 p-6"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
      {/* Мовний перемикач */}

      <LanguageSwitcher locale={locale} />

      <button
        className="lg:hidden cursor-pointer p-2 rounded-md hover:bg-gray-100 transition"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
        type="button"
      >
        {isMenuOpen ? <XIcon /> : <MenuIcon />}
      </button>
    </nav>
  );
}
