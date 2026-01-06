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
import { getEvents, deleteEvent } from "@/helper/api/viewEventsData";
import { EventForm } from "@/components/Administration/EventForm/EventForm";
import { useLocale, useTranslations } from "next-intl";
import { IEvent } from "@/helper/types/event";

export default function EventsDashboardPage() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IEvent | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const locale = useLocale();
  const t = useTranslations("events");
  const token = Cookies.get("accessToken");

  const fetchData = useCallback(async () => {
    if (!token) return;
    const data = await getEvents(token, page, 10, search);
    setItems(data.events);
    setTotalPages(data.totalPages);
  }, [token, page, search]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchData(), 500); // Debounce пошуку
    return () => clearTimeout(delayDebounce);
  }, [fetchData]);

  return (
    <div className="p-10 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold">Управління івентами</h1>
            <div className="flex gap-2">
              <Input
                label="search"
                id="search"
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

          <table className="w-full border text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Фото</th>
                <th className="p-3">Назва</th>
                <th className="p-3">Категорія</th>
                <th className="p-3">Дії</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(items) &&
                items.map((item: IEvent) => (
                  <tr key={item._id} className="border-t">
                    <td className="p-3">
                      {item.images?.[0] && (
                        <Image
                          src={item.images[0]}
                          width={40}
                          height={40}
                          className="rounded"
                          alt=""
                        />
                      )}
                    </td>
                    <td className="p-3 font-medium">
                      {item.title?.[locale] || item.title?.uk}
                    </td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3 flex gap-2">
                      <Button
                        onClick={() => {
                          setEditing(item);
                          setModalOpen(true);
                        }}
                      >
                        Редагувати
                      </Button>
                      <Button
                        className="bg-red-500"
                        onClick={async () => {
                          if (confirm("Видалити?")) {
                            await deleteEvent(token!, item._id);
                            fetchData();
                          }
                        }}
                      >
                        Видалити
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Пагінація */}
          <div className="flex justify-center gap-2 mt-6">
            <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Назад
            </Button>
            <span className="py-2 px-4 border rounded bg-gray-50">
              Сторінка {page} з {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Вперед
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Редагувати" : "Створити"} івент
            </DialogTitle>
          </DialogHeader>
          <EventForm
            event={editing}
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
