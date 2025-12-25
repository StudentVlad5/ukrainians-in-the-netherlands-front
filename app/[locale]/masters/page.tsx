"use client";
import MastersFilter from "@/components/Masters/MastersFilter";
import MastersGrid from "@/components/Masters/MastersGrid";
import { getPublicSpecialists } from "@/helper/api/getPublicData";
import { onFetchError } from "@/lib/Messages/NotifyMessages";
import { useEffect, useState } from "react";
import { ISpecialist } from "@/helper/types/specialist";

export default function MastersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [profession, setProfession] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [masters, setMasters] = useState<ISpecialist[]>([]);
  const [getError, setGetError] = useState(false);

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
        onFetchError("Не вдалося завантажити майстрів");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasters();
  }, []);

  const filteredMasters = masters.filter((m) => {
    const matchesName = Object.values(m.name || {}).some((val) =>
      val.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesJob =
      profession === "" ||
      Object.values(m.specialty || {}).some((val) =>
        val.toLowerCase().includes(profession.toLowerCase())
      );
    return matchesName && matchesJob;
  });

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            Наші спеціалісти
          </h1>
          <p className="mt-2 text-gray-600 max-w-xl">
            Оберіть перевіреного майстра у вашій сфері
          </p>
        </div>

        <MastersFilter
          filterQuery={searchQuery}
          onSearch={setSearchQuery}
          selectedProfession={profession}
          onProfessionChange={setProfession}
        />
        {isLoading ? (
          <div className="text-center py-20">Завантаження...</div>
        ) : getError ? (
          <div className="text-center py-20 text-red-500">
            Помилка завантаження даних
          </div>
        ) : (
          <MastersGrid filteredMasters={filteredMasters} />
        )}
      </div>
    </section>
  );
}
