"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher({ locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const locales = ["ua", "nl", "de"];

  const changeLanguage = (newLocale) => {
    const pathWithoutLocale = pathname.split("/").slice(2).join("/");
    router.push(`/${newLocale}/${pathWithoutLocale}`);
  };

  return (
    <div className="flex gap-2">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => changeLanguage(l)}
          className={`px-2 py-1 rounded ${
            l === locale
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
