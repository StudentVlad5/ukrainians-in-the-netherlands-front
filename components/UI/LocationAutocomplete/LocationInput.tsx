"use client";

import { useState, useEffect, useRef } from "react";
import { ILocationPlace } from "@/helper/types/locationPlace";
import { useLocale, useTranslations } from "next-intl";
import { Lang } from "@/helper/types/common";
import { motion, AnimatePresence } from "framer-motion";
import { LocationInputProps } from "@/helper/types/locationInput";

export const LocationInput = ({
  value,
  onChange,
  error,
  label,
  placeholder,
}: LocationInputProps) => {
  const t = useTranslations("add_specialist");
  const locale = useLocale() as Lang;

  const [searchTerm, setSearchTerm] = useState(value?.address || "");
  const [suggestions, setSuggestions] = useState<ILocationPlace[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Закриваємо список при кліку поза компонентом
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Пошук з дебаунсом
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2 && isOpen) {
        setIsGeocoding(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              searchTerm
            )}&limit=5&accept-language=en`
          );
          const data = await res.json();
          setSuggestions(data);
        } catch (e) {
          console.error("Geocoding error:", e);
        } finally {
          setIsGeocoding(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, locale, isOpen]);

  const handleSelect = (item: ILocationPlace) => {
    const newValue = {
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    };
    setSearchTerm(item.display_name);
    setIsOpen(false);
    setSuggestions([]);
    onChange(newValue); // Передаємо дані "батьку"
  };

  return (
    <div ref={wrapperRef} className="space-y-1 relative">
      {label && <label className="text-sm font-bold block mb-1">{label}</label>}

      <div className="relative">
        <input
          type="text"
          className={`w-full p-2 border rounded-lg text-sm pr-10 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={placeholder || t("Enter a city (eg Amsterdam, NL)")}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />

        {isGeocoding && (
          <div className="absolute right-3 top-2.5 animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-[100] w-full bg-white border border-gray-200 rounded-lg shadow-2xl mt-1 max-h-60 overflow-y-auto"
          >
            {suggestions.map((item, index) => (
              <li
                key={index}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm transition-colors border-b last:border-none flex flex-col"
                onClick={() => handleSelect(item)}
              >
                <span className="font-medium text-gray-700">
                  {item.display_name}
                </span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};
