"use client";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/Products/ProductCard";
import { getPublicProductssWithLimits } from "@/helper/api/getPublicData";
import { IProduct } from "@/helper/types/product";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/Pagination/Pagination";

const ProductList = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

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
    fetchProducts(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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
          {!loading && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
