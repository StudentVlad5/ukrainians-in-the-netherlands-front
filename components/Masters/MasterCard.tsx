"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import defaultImage from "@/public/images/no-photo-available-icon.jpg";

interface IProvider {
  id: number;
  name: string;
  specialty: string;
  imageUrl: string;
  description: string;
  rating: number;
  education: string;
  languages: string[]; // Додаємо масив мов (напр. ["UA", "EN", "NL"])
}

export default function MasterCard({ master }: { master: IProvider }) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
    >
      {/* Контейнер для фото з градієнтом */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={master.imageUrl || defaultImage}
          alt={master.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Оверлей для м'якого читання тексту поверх фото */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Рейтинг у верхньому куті */}
        <div className="absolute top-4 right-4 backdrop-blur-md bg-white/70 px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          <span className="text-ua-yellow text-sm">★</span>
          <span className="text-xs font-bold text-gray-800">
            {master.rating}
          </span>
        </div>

        {/* Мови спілкування поверх фото */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {master.languages?.map((lang) => (
            <span
              key={lang}
              className="text-[10px] font-bold bg-nl-blue/80 text-white px-2 py-1 rounded-md backdrop-blur-sm border border-white/20 uppercase"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Контентна частина */}
      <div className="p-5">
        <div className="mb-1">
          <span className="text-[10px] uppercase tracking-wider font-bold text-nl-red">
            {master.specialty}
          </span>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-nl-blue transition-colors">
            {master.name}
          </h3>
        </div>

        <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed h-10">
          {master.description}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
              Освіта
            </span>
            <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
              {master.education}
            </span>
          </div>

          <button className="bg-nl-red hover:bg-nl-blue text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-nl-red/20">
            Записатись
          </button>
        </div>
      </div>
    </motion.article>
  );
}
