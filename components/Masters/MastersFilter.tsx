"use client";

import { getPublickServiceCategories } from "@/helper/api/getPublicData";
import { ICategory } from "@/helper/types/category";
import { Lang } from "@/helper/types/common";
import { useLocale } from "next-intl";
import { useEffect, useState, useRef } from "react";

interface MastersFilterProps {
  filterQuery: string;
  selectedCategories: string[]; // Тепер масив ID
  onSearch: (query: string) => void;
  onCategoriesChange: (categories: string[]) => void; // Колбек для масиву
}

export default function MastersFilter({
  onSearch,
  filterQuery,
  selectedCategories,
  onCategoriesChange,
}: MastersFilterProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const locale = useLocale() as Lang;
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  }, []);

  // Закриття при кліку поза компонентом
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCategory = (id: string) => {
    const newSelected = selectedCategories.includes(id)
      ? selectedCategories.filter((item) => item !== id)
      : [...selectedCategories, id];
    onCategoriesChange(newSelected);
  };

  const filteredCategories = categories.filter((c) =>
    c.title[locale].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-8 flex flex-col md:flex-row gap-4 items-start">
      {/* Пошук за назвою */}
      <input
        placeholder="Пошук по імені..."
        className="w-full md:w-80 p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        value={filterQuery}
        onChange={(e) => onSearch(e.target.value)}
      />

      {/* Custom Multi-Select */}
      <div className="relative w-full md:w-96" ref={dropdownRef}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="min-h-[40px] p-2 border rounded-lg bg-white cursor-pointer flex flex-wrap gap-2 items-center"
        >
          {selectedCategories.length === 0 && (
            <span className="text-gray-400 text-sm italic">
              Оберіть категорії...
            </span>
          )}
          {selectedCategories.map((id) => {
            const cat = categories.find((c) => c._id === id);
            return (
              <span
                key={id}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
              >
                {cat?.title[locale]}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(id);
                  }}
                  className="hover:text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-2xl max-h-80 flex flex-col">
            <div className="p-2 border-b">
              <input
                autoFocus
                placeholder="Шукати категорію..."
                className="w-full p-2 text-sm border rounded outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedCategories.includes(c._id)}
                      onChange={() => toggleCategory(c._id)}
                    />
                    <span className="text-sm text-gray-700">
                      {c.title[locale]}
                    </span>
                  </label>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500 text-center">
                  Нічого не знайдено
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
