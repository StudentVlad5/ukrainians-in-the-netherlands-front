"use client";
import MastersFilter from "@/components/Masters/MastersFilter";
import MastersGrid from "@/components/Masters/MastersGrid";
import { masters } from "@/helper/CONST";
import { useState } from "react";

export default function MastersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [profession, setProfession] = useState("");

  const filteredMasters = masters.filter((m) => {
    const matchesName = m.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesJob = profession === "" || m.specialty === profession;
    return matchesName && matchesJob;
  });

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-nlBlue">
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
        <MastersGrid filteredMasters={filteredMasters} />
      </div>
    </section>
  );
}
