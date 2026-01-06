import {
  getPublicProductssWithLimits,
  getPublicServicesWithLimits,
} from "@/helper/api/getPublicData";
import { onFetchError } from "@/lib/Messages/NotifyMessages";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "use-intl";
import { MarketplaceCard } from "./MarketplaceCard";
import { MarketplaceCardSkeleton } from "./MarketplaceCardSkeleton";

/* =======================
   API TYPES
======================= */

interface ProductApi {
  _id: string;
  title: Record<string, string>;
  price: number;
  category: string;
  images: string[];
  location: {
    city: string;
  };
}

interface ServiceApi {
  id: string;
  image: string;
  specialty: Record<string, string>;
  price: number;
  location: string;
}

/* =======================
   UI TYPE
======================= */

interface IMarketItem {
  id: string;
  type: "product" | "service";
  title: string;
  subtitle: string;
  imageUrl: string;
  price: number;
  location: string;
}

/* =======================
   COMPONENT
======================= */

export const MarketplaceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"products" | "services">(
    "products"
  );
  const [products, setProducts] = useState<IMarketItem[]>([]);
  const [services, setServices] = useState<IMarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations("market");
  const locale = useLocale() as "uk" | "en" | "nl" | "de";

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        setIsLoading(true);

        const [resProducts, resServices] = await Promise.all([
          getPublicProductssWithLimits(10),
          getPublicServicesWithLimits(10),
        ]);

        /* PRODUCTS */
        if (Array.isArray(resProducts?.data)) {
          const mappedProducts: IMarketItem[] = resProducts.data.map(
            (p: ProductApi) => ({
              id: p._id,
              type: "product",
              title: p.title[locale] ?? p.title.en,
              subtitle: p.category,
              imageUrl: p.images[0],
              price: p.price,
              location: p.location?.city || "—",
            })
          );
          setProducts(mappedProducts);
        }

        /* SERVICES */
        if (Array.isArray(resServices?.data)) {
          const mappedServices: IMarketItem[] = resServices.data.map(
            (s: ServiceApi) => ({
              id: s.id,
              type: "service",
              title: s.specialty[locale] ?? s.specialty.en,
              subtitle: t("service"),
              imageUrl: s.image,
              price: s.price,
              location: s.location,
            })
          );
          setServices(mappedServices);
        }
      } catch (e) {
        onFetchError(t("Failed to load goods"));
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoods();
  }, [locale, t]);

  const currentItems = activeTab === "products" ? products : services;

  return (
    <section id="market" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Ринок: Зроблено Українцями
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-10 border-b">
          {(["products", "services"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-6 font-semibold transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab === "products" ? "Товари" : "Послуги"}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {isLoading &&
            Array.from({ length: 10 }).map((_, i) => (
              <MarketplaceCardSkeleton key={i} />
            ))}

          {!isLoading &&
            currentItems.map((item) => (
              <MarketplaceCard key={item.id} {...item} />
            ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href={activeTab === "products" ? "/products" : "/masters"}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
          >
            {activeTab === "products" ? "Всі товари" : "Всі послуги"}
          </a>
        </div>
      </div>
    </section>
  );
};
