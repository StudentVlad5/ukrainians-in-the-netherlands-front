"use client";

interface StaticPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const StaticPagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: StaticPaginationProps) => {
  if (totalPages <= 1) return null;

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
    <div className="flex justify-center items-center mt-6 gap-2">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        ←
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          type="button"
          disabled={page === "..."}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`px-4 py-2 border rounded-md transition-colors cursor-pointer ${
            currentPage === page
              ? "bg-black text-white border-black" // змінено стиль для адмінки
              : "hover:bg-gray-50 text-gray-700 border-gray-200"
          } ${page === "..." ? "border-transparent cursor-default" : ""}`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-2 border rounded-md disabled:opacity-30 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        →
      </button>
    </div>
  );
};
