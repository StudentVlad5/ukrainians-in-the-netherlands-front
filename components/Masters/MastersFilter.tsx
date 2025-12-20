"use client";

import { InputSelect } from "@/components/UI/InputSelect/InputSelect";

interface MastersFilterProps {
  filterQuery: string;
  selectedProfession: string; // додаємо нові пропси для професії
  onSearch: (query: string) => void;
  onProfessionChange: (profession: string) => void; // колбек для селекта
}

export default function MastersFilter({
  onSearch,
  filterQuery,
  selectedProfession,
  onProfessionChange,
}: MastersFilterProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row gap-4">
      {/* Інпут для тексту */}
      <InputSelect
        placeholder="Пошук по імені або спеціалізації"
        className="md:w-96"
        value={filterQuery} // Прив'язуємо значення до стану
        onChange={(e) => onSearch(e.target.value)}
      />

      {/* Селект для категорій */}
      <select
        name="profession"
        title="profession"
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ua-blue bg-white"
        value={selectedProfession}
        onChange={(e) => onProfessionChange(e.target.value)}
      >
        <option value="">Усі сфери</option>
        <option value="barber">Барбер</option>
        <option value="massage">Масаж</option>
        <option value="cosmetologist">Косметолог</option>
      </select>
    </div>
  );
}
