"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import MastersFilter, {
  IFilterState,
} from "@/components/Masters/MastersFilter";
import MastersGrid from "@/components/Masters/MastersGrid";
import { MasterCardSkeleton } from "@/components/Masters/MasterCardSkeleton";
import { Pagination } from "@/components/Pagination/Pagination";
import { getPublicSpecialists } from "@/helper/api/getPublicData";
import { ISpecialist } from "@/helper/types/specialist";
import { onFetchError } from "@/lib/Messages/NotifyMessages";
import { PaginationProps } from "@/helper/types/pagination";

export default function MastersPage() {
  const t = useTranslations("specialists");
  const router = useRouter();
  const searchParams = useSearchParams();

  const STORAGE_KEY = "masters_filter_settings";

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    data: ISpecialist[];
    pagination: PaginationProps;
  }>({
    data: [],
    pagination: { totalPages: 0, currentPage: 1 },
  });
  // localstorige saving data of the filters
  useEffect(() => {
    const hasParams = searchParams.toString().length > 0;
    const savedFilters = localStorage.getItem(STORAGE_KEY);

    if (!hasParams && savedFilters) {
      try {
        const filters: IFilterState = JSON.parse(savedFilters);
        // Застосовуємо збережені фільтри до URL
        handleApply(filters);
      } catch (e) {
        console.error("Error parsing saved filters", e);
      }
    }
  }, []);

  // 1. Отримуємо фільтри з URL для передачі в компонент Filters
  const currentFilters: IFilterState = {
    search: searchParams.get("search") || "",
    categories:
      searchParams.get("categories")?.split(",").filter(Boolean) || [],
    location: searchParams.get("lat")
      ? {
          address: searchParams.get("address") || "",
          lat: Number(searchParams.get("lat")),
          lng: Number(searchParams.get("lng")),
        }
      : null,
    radius: Number(searchParams.get("radius")) || 50,
  };

  // Викликаємо фетч при кожній зміні параметрів URL
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        setIsLoading(true);
        // Перетворюємо всі параметри URL в об'єкт для API
        const params = Object.fromEntries(searchParams.entries());
        const response = await getPublicSpecialists(params);
        setData(response);
      } catch (e) {
        onFetchError(t("Error loading data"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchMasters();
  }, [searchParams, t]);

  // 3. Обробники подій
  const handleApply = (filters: IFilterState) => {
    // Зберігаємо в LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));

    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.categories.length)
      params.set("categories", filters.categories.join(","));
    if (filters.location) {
      const { lat, lng, address } = filters.location;

      if (lat != null && lng != null) {
        params.set("lat", lat.toString());
        params.set("lng", lng.toString());
        if (address) params.set("address", address);
        params.set("radius", filters.radius.toString());
      }
    }
    params.set("currentPage", "1");
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/masters");
    localStorage.removeItem(STORAGE_KEY);
  };

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

        <MastersFilter
          initialFilters={currentFilters}
          onApply={handleApply}
          onReset={handleReset}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <MasterCardSkeleton key={i} />
            ))}
          </div>
        ) : data.data.length > 0 ? (
          <>
            <MastersGrid filteredMasters={data.data} />
            <Pagination
              totalPages={data.pagination.totalPages}
              currentPage={data.pagination.currentPage}
            />
          </>
        ) : (
          <div className="text-center py-20 text-gray-500">
            {t("No masters found for your request")}
          </div>
        )}
      </div>
    </section>
  );
}
