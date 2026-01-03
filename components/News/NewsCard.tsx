import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { INews } from "@/helper/types/news";
import { Lang } from "@/helper/types/common";
import defaultImage from "@/public/images/no-photo-available-icon.jpg";

export default function NewsCard({ item }: { item: INews }) {
  const locale = useLocale() as Lang;
  const t = useTranslations("news");
  return (
    <Link href={`/news/${item.slug || item._id}`}>
      <article className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={item.imageUrl || defaultImage}
            alt={item.title[locale] || ""}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 bg-ua-blue text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
            {item.category?.[locale] || "News"}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <span className="text-gray-400 text-sm font-bold mb-2">
            {new Date(item.date).toLocaleDateString(locale)}
          </span>
          <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-ua-blue transition-colors">
            {item.title[locale]}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
            {item.shortDescription[locale]}
          </p>
          <div className="text-ua-blue font-black text-xs uppercase tracking-widest flex items-center gap-2">
            {t("Read more")} <span className="text-lg">→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
