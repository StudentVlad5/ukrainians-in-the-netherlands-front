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
import { Input } from "@/components/UI/Input/Input";
import Image from "next/image";
import Cookies from "js-cookie";
import { getEvents } from "@/helper/api/viewEventsData";
import { EventForm } from "@/components/Administration/EventForm/EventForm";
import { useLocale } from "next-intl";
import { IEvent } from "@/helper/types/event";
import { getCategories } from "@/helper/api/viewCategoriesData";
import { refreshUserProfile } from "@/helper/api/viewProfileData";
import { getSpecialists } from "@/helper/api/viewSpecialistData";
import { ITranslatableString } from "@/helper/types/category";

export default function EventsDashboardPage() {
  const [items, setItems] = useState<IEvent[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IEvent | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const locale = useLocale();
  const currentLocale = locale as keyof ITranslatableString;
  const token = Cookies.get("accessToken");

  const [categories, setCategories] = useState<
    { _id: string; title: string | ITranslatableString }[]
  >([]);
  const [specialists, setSpecialists] = useState<
    { _id: string; name: string | ITranslatableString }[]
  >([]);
  const [userRole, setUserRole] = useState<string>("");

  // 🔹 initial data

  useEffect(() => {
    const loadInitialData = async () => {
      if (!token) return;
      try {
        const [cats, profile, specs] = await Promise.all([
          getCategories(token),
          refreshUserProfile(token),
          getSpecialists(token),
        ]);
        setCategories(cats);
        setUserRole(profile.role);
        setSpecialists(specs);
      } catch (err) {
        console.error("Помилка завантаження даних:", err);
      }
    };
    loadInitialData();
  }, [token]);

  // 🔹 events
  const fetchData = useCallback(async () => {
    if (!token) return;
    const data = await getEvents(token, page, 10, search);
    setItems(data.events);
    setTotalPages(data.totalPages);
  }, [token, page, search]);

  useEffect(() => {
    const t = setTimeout(fetchData, 500);
    return () => clearTimeout(t);
  }, [fetchData]);

  return (
    <div className="p-10 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold">Управління івентами</h1>
            <div className="flex gap-2">
              <Input
                id="search"
                label="search"
                placeholder="Пошук..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              <Button
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
              >
                Додати івент
              </Button>
            </div>
          </div>

          <table className="w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Фото</th>
                <th className="p-3">Назва</th>
                <th className="p-3">Категорія</th>
                <th className="p-3">Спеціаліст</th>
                <th className="p-3">Дії</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const title =
                  typeof item.title === "string"
                    ? item.title
                    : item.title?.[currentLocale] || item.title?.uk;

                const category = categories.find(
                  (c) => c._id === item.category
                );
                const categoryName =
                  typeof category?.title === "object"
                    ? category.title[currentLocale]
                    : category?.title;

                const specialist = specialists.find(
                  (s) => s._id === item.specialistId
                );
                const specialistName =
                  typeof specialist?.name === "object"
                    ? specialist.name[currentLocale]
                    : specialist?.name;

                return (
                  <tr key={item._id} className="border-t">
                    <td className="p-3">
                      {item.images?.[0] && (
                        <Image
                          src={item.images[0]}
                          width={40}
                          height={40}
                          alt=""
                        />
                      )}
                    </td>
                    <td className="p-3">{title}</td>
                    <td className="p-3">{categoryName}</td>
                    <td className="p-3">{specialistName || "—"}</td>
                    <td className="p-3">
                      <Button
                        onClick={() => {
                          setEditing(item);
                          setModalOpen(true);
                        }}
                      >
                        Редагувати
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-center gap-2 mt-6">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Назад
            </Button>
            <span>
              {page} / {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Вперед
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Редагування івенту" : "Новий івент"}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            event={editing}
            token={token}
            onSaved={() => {
              setModalOpen(false);
              fetchData();
            }}
            categories={categories}
            specialists={specialists}
            userRole={userRole}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
