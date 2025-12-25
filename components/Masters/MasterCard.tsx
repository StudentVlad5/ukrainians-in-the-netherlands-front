"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import defaultImage from "@/public/images/no-photo-available-icon.jpg";
import Link from "next/link";
import { ISpecialist } from "@/helper/types/specialist";
import { useLocale } from "next-intl";

// Визначаємо інтерфейс пропсів правильно
interface MasterCardProps {
  master: ISpecialist;
}

export default function MasterCard({ master }: MasterCardProps) {
  const locale = useLocale();

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={master.imageUrl || defaultImage}
          // Використовуємо локаль для name
          alt={master.name[locale as keyof typeof master.name] || "Master"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-4 right-4 backdrop-blur-md bg-white/70 px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          <span className="text-ua-yellow text-sm">★</span>
          <span className="text-xs font-bold text-gray-800">
            {master.rating || 0}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 flex gap-2">
          {master.languages?.map((lang) => (
            <span
              key={lang}
              className="text-[10px] font-bold bg-blue-600/80 text-white px-2 py-1 rounded-md backdrop-blur-sm border border-white/20 uppercase"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-1">
          <span className="text-[10px] uppercase tracking-wider font-bold text-red-600">
            {/* Використовуємо локаль для specialty */}
            {master.specialty[locale as keyof typeof master.specialty]}
          </span>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {/* Використовуємо локаль для name */}
            {master.name[locale as keyof typeof master.name]}
          </h3>
        </div>

        <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed h-10">
          {/* Використовуємо локаль для description з перевіркою */}
          {master.description
            ? master.description[locale as keyof typeof master.description]
            : ""}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
              Освіта
            </span>
            <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
              {/* Використовуємо локаль для education */}
              {master.education
                ? master.education[locale as keyof typeof master.education]
                : "Не вказано"}
            </span>
          </div>

          <Link
            href={`/masters/${master._id}`}
            className="bg-red-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-red-500/20 cursor-pointer"
          >
            Записатись
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
