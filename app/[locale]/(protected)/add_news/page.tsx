"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/UI/Card/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/Dialog/dialog";
import { Button } from "@/components/UI/Button/Button";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

import { INews } from "@/helper/types/news";
import { getNews, deleteNews } from "@/helper/api/viewNewsData";
import { refreshUserProfile } from "@/helper/api/viewProfileData";
import { NewsForm } from "@/components/Administration/NewsForm/NewsForm";
import type { Lang } from "@/helper/types/common";

export default function NewsDashboardPage() {
  const [items, setItems] = useState<INews[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<INews | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const token = Cookies.get("accessToken");
  const t = useTranslations("news_admin");
  const locale = useLocale() as Lang;

  // 1. Перевірка доступу
  useEffect(() => {
    const checkAccess = async () => {
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const data = await refreshUserProfile(token);
        if (data.role !== "seller" && data.role !== "admin") {
          router.push("/profile");
        }
      } catch {
        router.push("/login");
      }
    };
    checkAccess();
  }, [router, token]);

  // 2. Завантаження даних
  const fetchData = useCallback(async () => {
    const token = Cookies.get("accessToken");
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getNews(token);
      setItems(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item: INews) => {
    setEditing(item);
    setModalOpen(true);
  };

  const remove = async (id?: string) => {
    if (!id || !confirm(t("Are you sure?"))) return;
    const token = Cookies.get("accessToken");
    if (!token) return;

    await deleteNews(token, id);
    fetchData();
  };

  return (
    <div className="p-10">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t("Manage News")}</h1>
            <Button onClick={openCreate}>{t("Add News Article")}</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 border-collapse bg-white">
              <thead className="bg-gray-100 text-left">
                <tr className="hover:bg-gray-50 transition-colors">
                  <th className="p-3 border">{t("Date")}</th>
                  <th className="p-3 border">{t("Image")}</th>
                  <th className="p-3 border">{t("Title")}</th>
                  <th className="p-3 border">{t("Category")}</th>
                  <th className="p-3 border">{t("Status")}</th>
                  <th className="p-3 border text-center">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((news) => (
                  <tr
                    key={news._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 border text-sm">
                      {/* Форматування дати дд.мм.рррр */}
                      {new Date(news.date).toLocaleDateString("uk-UA")}
                    </td>
                    <td className="p-3 border">
                      {news.imageUrl && (
                        <Image
                          src={news.imageUrl}
                          width={60}
                          height={40}
                          alt=""
                          className="rounded object-cover"
                        />
                      )}
                    </td>
                    <td className="p-3 border font-medium max-w-xs truncate">
                      {/* Вивід заголовка з перекладом */}
                      {news.title?.[locale] || news.title?.uk}
                    </td>
                    <td className="p-3 border">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs whitespace-nowrap">
                        {/* ВИПРАВЛЕНО: вивід категорії як тексту */}
                        {news.category?.[locale] ||
                          news.category?.uk ||
                          t("No category")}
                      </span>
                    </td>
                    <td className="p-3 border text-center">
                      {news.isActive ? (
                        <span className="text-green-600 text-sm">
                          ● {t("Active")}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          ○ {t("Draft")}
                        </span>
                      )}
                    </td>
                    <td className="p-3 border">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="secondary"
                          className="h-8 px-3 text-xs cursor-pointer"
                          onClick={() => openEdit(news)}
                        >
                          {t("Edit")}
                        </Button>
                        <Button
                          variant="danger"
                          className="bg-red-500 h-8 px-3 text-xs cursor-pointer"
                          onClick={() => remove(news._id)}
                        >
                          {t("Delete")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? t("Edit News Article") : t("Create News Article")}
            </DialogTitle>
          </DialogHeader>

          <NewsForm
            key={editing?._id || "new-news"}
            initialData={editing}
            token={token}
            onSaved={() => {
              setModalOpen(false);
              fetchData();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
