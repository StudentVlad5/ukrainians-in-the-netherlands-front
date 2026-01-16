"use client";

import { PaginationProps } from "@/helper/types/pagination";
import { useRouter, useSearchParams } from "next/navigation";

export const Pagination = ({ totalPages, currentPage }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    router.push(createPageURL(page));
  };

  // Логіка для відображення номерів сторінок (напр. 1, 2 ... 10)
  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-12 gap-2">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-3 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition-colors"
      >
        ← Назад
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          type="button"
          key={index}
          disabled={page === "..."}
          onClick={() => typeof page === "number" && handlePageChange(page)}
          className={`px-4 py-2 border rounded-md transition-colors ${
            currentPage === page
              ? "bg-blue-600 text-white border-blue-600"
              : "hover:bg-gray-100 text-gray-700"
          } ${page === "..." ? "border-transparent cursor-default" : ""}`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-3 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition-colors"
      >
        Вперед →
      </button>
    </div>
  );
};
