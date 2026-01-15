"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/UI/Card/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/Dialog/dialog";
import { Button } from "@/components/UI/Button/Button";
import { Input } from "@/components/UI/Input/Input";
import Cookies from "js-cookie";
import { useLocale } from "next-intl";
import { ICategory } from "@/helper/types/category";
import { CategoryForm } from "@/components/Administration/CategoryForm/categoryForm";
import { Lang } from "@/helper/types/common";
import {
  deleteServiceCategory,
  getServiceCategories,
} from "@/helper/api/viewServiceCategoriesData";
import { StaticPagination } from "@/components/Pagination/StaticPagination";

export default function ServiceCategoriesDashboard() {
  const [items, setItems] = useState<ICategory[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ICategory | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const locale = useLocale() as Lang;
  const token = Cookies.get("accessToken");

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await getServiceCategories(token);
      setItems(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Логіка фільтрації та пагінації (useMemo для оптимізації)
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.title[locale]?.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search, locale]);

  // Розрахунок загальної кількості сторінок
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Отримання даних саме для поточної сторінки
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити категорію?")) return;
    await deleteServiceCategory(token, id);
    fetchData();
  };

  return (
    <div className="p-10 space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Категорії</h1>
            <div className="flex gap-4">
              <Input
                id="search"
                label="search"
                placeholder="Пошук за назвою або ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
              <Button
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
              >
                Додати категорію
              </Button>
            </div>
          </div>

          <table className="w-full border text-left">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="p-3">Назва ({locale})</th>
                <th className="p-3 text-right">Дії</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 font-medium">
                    {cat.title[locale] || cat.title.uk}
                  </td>
                  <td className="p-3 text-right space-x-2 flex items-center justify-end">
                    <div className="flex gap-2 h-[100%] items-center">
                      <Button
                        onClick={() => {
                          setEditing(cat);
                          setModalOpen(true);
                        }}
                      >
                        Редагувати
                      </Button>
                      <Button
                        className="bg-red-500"
                        onClick={() => handleDelete(cat._id!)}
                      >
                        Видалити
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Редагувати" : "Створити"} категорію
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            type={"service"}
            category={editing}
            token={token}
            onSaved={() => {
              setModalOpen(false);
              fetchData();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Пагінація */}
      {!isLoading && totalPages > 1 && (
        <div className="pt-4 border-t">
          <StaticPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
