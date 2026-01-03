"use client";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/Products/ProductCard";
import { getPublicProductssWithLimits } from "@/helper/api/getPublicData";
import { IProduct } from "@/helper/types/product";

const ProductList = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (page: number) => {
    setLoading(true);
    try {
      // Очікуємо, що API поверне { data: [...], pagination: {...} }
      const res = await getPublicProductssWithLimits(8, page);

      if (res && res.data) {
        setData(res.data);
        setPagination(res.pagination);
      } else if (Array.isArray(res)) {
        // Фолбек, якщо API все ще повертає тільки масив
        setData(res);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(pagination.page);
    // Прокрутка вгору при зміні сторінки
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pagination.page]);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((product: IProduct) => (
              <ProductCard
                key={product._id}
                product={product} // Передаємо сам об'єкт продукту
              />
            ))}
          </div>

          {/* Пагінація */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-4">
              <button
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-blue-50 transition-colors"
              >
                Назад
              </button>

              <span className="text-gray-600 font-medium">
                {pagination.page} / {pagination.totalPages}
              </span>

              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-blue-50 transition-colors"
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
