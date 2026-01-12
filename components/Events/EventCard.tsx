import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { IActiveEvent } from "@/helper/types/activeEvent";
import { Lang } from "@/helper/types/common";
import defaultImage from "@/public/images/no-photo-available-icon.jpg";
import { motion } from "framer-motion";
import { it } from "@/helper/CONST";

export default function EventCard({
  item,
  isLoading,
}: {
  item: IActiveEvent;
  isLoading?: boolean;
}) {
  const locale = useLocale() as Lang;
  const t = useTranslations("events");

  return (
    <motion.article
      variants={it}
      key={item._id + isLoading}
      className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={item.parentEvent.images[0] || defaultImage}
          alt={item.parentEvent.title[locale] || ""}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Категорія івенту */}
        <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
          {item.parentEvent.category?.[locale] || t("event")}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Дата проведення івенту */}
        <span className="text-gray-400 text-sm font-bold mb-2">
          {new Date(item.date).toLocaleDateString(locale)}
        </span>

        <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {item.parentEvent.title[locale]}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
          {item.parentEvent.description[locale]}
        </p>
        <Link href={`/events/${item._id}`}>
          {" "}
          <div className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
            {t("readMore")} <span className="text-lg">→</span>
          </div>
        </Link>
      </div>
    </motion.article>
  );
}
