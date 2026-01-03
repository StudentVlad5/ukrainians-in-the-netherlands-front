import { ProductCardProps } from "@/helper/types/product";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export const ProductCard = ({ product }: ProductCardProps) => {
  const locale = useLocale();

  // Безпечне отримання перекладу
  const title = product.title?.[locale] || product.title?.["en"] || "No title";

  // Обробка категорії (вона теж може бути об'єктом перекладів у вас)
  const category =
    typeof product.category === "object"
      ? product.category[locale] || product.category["en"]
      : product.category;

  const mainImage =
    product.images?.[0] || "https://placehold.co/400x400?text=No+Image";

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image
          src={mainImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-tighter">
          {category}
        </span>
        <h3 className="text-base font-bold text-gray-800 mt-1 line-clamp-2 min-h-[3rem]">
          {title}
        </h3>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-black text-gray-900">
            €{product.price}
          </span>
          <Link
            href={`/products/${product._id}`}
            className="text-sm font-bold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Дивитись
          </Link>
        </div>
      </div>
    </div>
  );
};
