"use client";

import { getPublickServiceCategories } from "@/helper/api/getPublicData";
import { ICategory } from "@/helper/types/category";
import { Lang } from "@/helper/types/common";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useRef, useMemo } from "react";
import { LocationInput } from "../UI/LocationAutocomplete/LocationInput";
import { motion, AnimatePresence } from "framer-motion";

export interface IFilterState {
  search: string;
  categories: string[];
  location: { address?: string; lat?: number; lng?: number } | null;
  radius: number;
}

interface MastersFilterProps {
  initialFilters: IFilterState;
  onApply: (filters: IFilterState) => void;
  onReset: () => void;
}

const DEFAULT_STATE: IFilterState = {
  search: "",
  categories: [],
  location: null,
  radius: 50,
};

export default function MastersFilter({
  initialFilters,
  onApply,
  onReset,
}: MastersFilterProps) {
  const t = useTranslations("specialists");
  const locale = useLocale() as Lang;

  // Локальний стан для всіх полів фільтра
  const [localFilters, setLocalFilters] =
    useState<IFilterState>(initialFilters);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Це для кнопки "Скинути все"
  const isDirty = useMemo(() => {
    return JSON.stringify(localFilters) !== JSON.stringify(DEFAULT_STATE);
  }, [localFilters]);

  // Це для анімації кнопки "Показати результати"
  const isChangedFromApplied = useMemo(() => {
    return JSON.stringify(localFilters) !== JSON.stringify(initialFilters);
  }, [localFilters, initialFilters]);
  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getPublickServiceCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchCategory();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (id: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((item) => item !== id)
        : [...prev.categories, id],
    }));
  };

  const filteredCategories = categories.filter((c) =>
    c.title[locale].toLowerCase().includes(catSearch.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* 1. Пошук за ім'ям */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">
            {t("Search")}
          </label>
          <input
            placeholder={t("master_name") + "..."}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={localFilters.search}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, search: e.target.value })
            }
          />
        </div>

        {/* 2. Мульти-селект категорій */}
        <div className="space-y-1 relative" ref={dropdownRef}>
          <label className="text-sm font-bold text-gray-700">
            {t("Category")}
          </label>
          <div
            onClick={() => setIsCatOpen(!isCatOpen)}
            className="min-h-[40px] p-2 border border-gray-300 rounded-lg bg-white cursor-pointer flex flex-wrap gap-1 items-center"
          >
            {localFilters.categories.length === 0 ? (
              <span className="text-gray-400 text-sm italic">
                {t("all category")}
              </span>
            ) : (
              localFilters.categories.map((id) => (
                <span
                  key={id}
                  className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"
                >
                  {categories.find((c) => c._id === id)?.title[locale]}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(id);
                    }}
                    className="hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          <AnimatePresence>
            {isCatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-64 flex flex-col overflow-hidden"
              >
                <input
                  autoFocus
                  placeholder={t("Search") + "..."}
                  className="p-2 text-sm border-b outline-none"
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                />
                <div className="overflow-y-auto p-1">
                  {filteredCategories.map((c) => (
                    <label
                      key={c._id}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded transition-colors text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={localFilters.categories.includes(c._id)}
                        onChange={() => toggleCategory(c._id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      {c.title[locale]}
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Локація */}
        <div className="space-y-1">
          <LocationInput
            label={t("Location")}
            value={localFilters.location || undefined}
            onChange={(val) =>
              setLocalFilters({ ...localFilters, location: val })
            }
          />
        </div>

        {/* 4. Радіус */}
        <div className="space-y-1 bg-gray-50 p-2 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold text-gray-600">
              {t("Radius")}
            </label>
            <span className="text-xs font-bold text-blue-600">
              {localFilters.radius} {t("km")}
            </span>
          </div>
          <input
            title="distantion"
            type="range"
            min="5"
            max="200"
            step="5"
            className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
            value={localFilters.radius}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                radius: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* Кнопки керування */}
      <div className="flex gap-3 justify-end pt-2 border-t border-gray-50">
        <button
          type="button"
          onClick={() => {
            setLocalFilters(initialFilters);
            onReset();
          }}
          disabled={!isDirty}
          className={`px-5 py-2 text-sm font-semibold transition-colors
    ${
      isDirty
        ? "text-red-500 hover:text-red-700"
        : "text-gray-400 cursor-not-allowed"
    }
  `}
        >
          {t("Reset")}
        </button>
        <motion.button
          type="button"
          onClick={() => onApply(localFilters)}
          animate={
            isChangedFromApplied ? { scale: [1, 1.05, 1] } : { scale: 1 }
          }
          transition={
            isChangedFromApplied
              ? { repeat: Infinity, duration: 1.5 }
              : { duration: 0 }
          }
          className={`px-8 py-2 text-sm font-extrabold rounded-xl transition-all shadow-lg
    ${
      isChangedFromApplied
        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
          disabled={!isChangedFromApplied}
        >
          {t("apply filter")}
        </motion.button>
      </div>
    </div>
  );
}
