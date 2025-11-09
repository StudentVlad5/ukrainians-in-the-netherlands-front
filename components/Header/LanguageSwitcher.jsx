"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function LanguageSwitcher({ locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const locales = ["ua", "nl", "de", "en"];
  const [isAnimating, setIsAnimating] = useState(false);

  const changeLanguage = async (newLocale) => {
    setIsAnimating(true);

    // Дочекатися завершення анімації перед переходом
    await new Promise((res) => setTimeout(res, 300));

    const pathWithoutLocale = pathname.split("/").slice(2).join("/");
    router.push(`/${newLocale}/${pathWithoutLocale}`);
  };

  return (
    <div className="flex gap-2 font-black">
      {locales.map((l) => {
        const isActive = l === locale;
        return (
          <motion.button
            key={l}
            onClick={() => changeLanguage(l)}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`relative overflow-hidden px-2 py-1 rounded cursor-pointer
              ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
            `}
          >
            <span
              className={`${
                isActive ? "opacity-0" : "opacity-100"
              } transition-opacity`}
            >
              {l.toUpperCase()}
            </span>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  key={`${l}-flag`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-center bg-cover"
                  style={{
                    backgroundImage: `url('/svg_images/${l}-flag.svg')`,
                  }}
                />
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
