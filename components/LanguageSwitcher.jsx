"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LanguageSwitcher({ locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const locales = ["ua", "nl", "de", "en"];
  const [isAnimating, setIsAnimating] = useState(false);

  const changeLanguage = (newLocale) => {
    setIsAnimating(true);
    const pathWithoutLocale = pathname.split("/").slice(2).join("/");
    setTimeout(() => {
      router.push(`/${newLocale}/${pathWithoutLocale}`);
    }, 250);
  };

  return (
    <div className="flex gap-2">
      {locales.map((l) => (
        <motion.button
          key={l}
          onClick={() => changeLanguage(l)}
          animate={{ opacity: isAnimating ? 0 : 1 }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`px-2 py-1 rounded cursor-pointer
            ${
              l === locale
                ? "bg-blue-900 text-white"
                : "bg-gray-100 text-gray-700"
            }
            
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          `}
        >
          {l.toUpperCase()}
        </motion.button>
      ))}
    </div>
  );
}
