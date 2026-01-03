"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "use-intl";
import { IProduct } from "@/helper/types/product";
import { useParams } from "next/navigation";
import { getPublicProductsById } from "@/helper/api/getPublicData";

// Додамо інтерфейс для автора
interface IProductFull extends IProduct {
  user: {
    name: string | Record<string, string>;
    phone: string;
    telegram?: string;
    whatsapp?: string;
    email?: string;
  };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const locale = useLocale();
  const [product, setProduct] = useState<IProductFull | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getPublicProductsById(id);
        setProduct(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!product)
    return <div className="p-10 text-center">Product not found</div>;

  const title = product.title[locale] || product.title["en"];
  const description = product.description[locale] || product.description["en"];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Галерея зображень */}
        <div className="space-y-4">
          <div className="relative h-[400px] w-full rounded-2xl overflow-hidden border">
            <Image
              src={product.images[0]}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(1).map((img, idx) => (
              <div
                key={idx}
                className="relative h-24 rounded-lg overflow-hidden border"
              >
                <Image src={img} alt="thumb" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Інформація та контакти */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-2xl font-black text-blue-600 mt-4">
            €{product.price}
          </p>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-bold mb-2">Опис:</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
          </div>

          <hr className="my-8" />

          {/* Блок власника */}
          <div className="bg-white border-2 border-blue-50 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">Звязатися з продавцем</h3>
            <div className="flex flex-col gap-3">
              {/* Дзвінок */}
              <a
                href={`tel:${product.user.phone}`}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
              >
                <span>📞 Зателефонувати</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                {/* Telegram */}
                {product.user.telegram && (
                  <a
                    href={`https://t.me/${product.user.telegram.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 bg-[#229ED9] text-white py-3 rounded-xl font-bold"
                  >
                    Telegram
                  </a>
                )}

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${product.user.phone}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
