"use client";
import MastersFilter from "@/components/Masters/MastersFilter";
import MastersGrid from "@/components/Masters/MastersGrid";
import { MasterCardSkeleton } from "@/components/Masters/MasterCardSkeleton";
import { getPublicSpecialists } from "@/helper/api/getPublicData";
import { onFetchError } from "@/lib/Messages/NotifyMessages";
import { useEffect, useState } from "react";
import { ISpecialist } from "@/helper/types/specialist";
import { useTranslations } from "next-intl";

export default function MastersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  // 1. Змінюємо profession на масив selectedCategories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [masters, setMasters] = useState<ISpecialist[]>([]);
  const [getError, setGetError] = useState(false);
  const t = useTranslations("specialists");

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        setIsLoading(true);
        const data = await getPublicSpecialists();

        if (Array.isArray(data)) {
          setMasters(data);
          setGetError(false);
        }
      } catch (e) {
        setGetError(true);
        onFetchError(t("Не вдалося завантажити майстрів"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasters();
  }, [t]);

  // 2. Оновлена логіка фільтрації
  const filteredMasters = masters.filter((m) => {
    // Пошук за ім'ям (проходимо по всіх мовних полях об'єкта name)
    const matchesName = Object.values(m.name || {}).some((val) =>
      val.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Фільтрація за категоріями:
    // Якщо масив порожній — показуємо всіх.
    // Якщо ні — перевіряємо, чи входить категорія майстра в масив обраних.
    const matchesCategory =
      selectedCategories.length === 0 ||
      (m.category && selectedCategories.includes(m.category as string));

    return matchesName && matchesCategory;
  });

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            {t("Our specialists")}
          </h1>
          <p className="mt-2 text-gray-600 max-w-xl">
            {t("Choose a proven master in your field")}
          </p>
        </div>

        {/* 3. Оновлюємо пропси фільтра */}
        <MastersFilter
          filterQuery={searchQuery}
          onSearch={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MasterCardSkeleton />
            <MasterCardSkeleton />
            <MasterCardSkeleton />
          </div>
        ) : getError ? (
          <div className="text-center py-20 text-red-500">
            {t("Error loading data")}
          </div>
        ) : filteredMasters.length > 0 ? (
          <MastersGrid filteredMasters={filteredMasters} />
        ) : (
          <div className="text-center py-20 text-gray-500">
            {t("No masters found matching your criteria")}
          </div>
        )}
      </div>
    </section>
  );
}
