import Image from "next/image";
import { useState } from "react";
interface IMarketItem {
  id: number;
  type: "product" | "service";
  name: string;
  provider: string;
  imageUrl: string;
  price?: string;
}

const mockMarket: IMarketItem[] = [
  {
    id: 1,
    type: "product",
    name: 'Домашній торт "Наполеон"',
    provider: "Марія К.",
    imageUrl: "",
  },
  {
    id: 2,
    type: "service",
    name: "Професійна фотосесія",
    provider: "Олександр П.",
    imageUrl: "",
  },
  {
    id: 3,
    type: "product",
    name: "В'язані іграшки",
    provider: "Олена В.",
    imageUrl: "",
  },
  {
    id: 4,
    type: "service",
    name: "Манікюр та педикюр",
    provider: "Ірина С.",
    imageUrl: "",
  },
  {
    id: 5,
    type: "product",
    name: "Авторська кераміка",
    provider: "Тарас Г.",
    imageUrl: "",
  },
];

export const MarketplaceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"products" | "services">(
    "products"
  );

  const filteredItems = mockMarket.filter((item) =>
    activeTab === "products" ? item.type === "product" : item.type === "service"
  );

  return (
    <section id="market" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
          Ринок: Зроблено Українцями
        </h2>
        <p className="text-center text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
          Підтримайте українських підприємців у Нідерландах, купуючи їхні товари
          та замовляючи послуги.
        </p>

        {/* Таби */}
        <div className="flex justify-center mb-10 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`py-3 px-6 text-lg font-semibold transition-colors duration-300 ${
              activeTab === "products"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Товари
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`py-3 px-6 text-lg font-semibold transition-colors duration-300 ${
              activeTab === "services"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Послуги
          </button>
        </div>

        {/* Сітка товарів/послуг */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredItems.slice(0, 5).map(
            (
              item // Показуємо перші 5
            ) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden group transition-shadow duration-300 hover:shadow-xl"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/300x300/eeeeee/222222?text=Помилка+зображення")
                  }
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">від {item.provider}</p>
                  <a
                    href={`/market/${item.id}`}
                    className="text-sm font-semibold text-blue-600 mt-2 inline-block"
                  >
                    Детальніше
                  </a>
                </div>
              </div>
            )
          )}
        </div>

        <div className="text-center mt-12">
          <a
            href={activeTab === "products" ? "/products" : "/services"}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-colors duration-300"
          >
            {activeTab === "products" ? "Всі товари" : "Всі послуги"}
          </a>
        </div>
      </div>
    </section>
  );
};
