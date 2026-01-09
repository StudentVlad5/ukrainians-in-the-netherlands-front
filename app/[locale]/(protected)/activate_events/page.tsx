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
import Cookies from "js-cookie";
import { useLocale } from "next-intl";
import { Lang } from "@/helper/types/common";
import {
  getActiveEvents,
  deleteActiveEvent,
} from "@/helper/api/viewActiveEventsData";
import { ActiveEventForm } from "@/components/Administration/ActiveEventForm/ActiveEventForm";
import { IActiveEvent } from "@/helper/types/activeEvent";
import { getEvents } from "@/helper/api/viewEventsData";
import { IEvent } from "@/helper/types/event";

export default function ActiveEventsDashboard() {
  const [baseEvents, setBaseEvents] = useState<IEvent[]>([]);
  const [items, setItems] = useState<IActiveEvent[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IActiveEvent | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const locale = useLocale() as Lang;
  const token = Cookies.get("accessToken");

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await getActiveEvents(token, {
        page,
        limit: 10,
        search,
        filter: statusFilter,
      });
      setItems(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token, page, search, statusFilter]);

  useEffect(() => {
    // Завантажуємо список базових подій для вибору
    getEvents(token, 1, 1000).then((res) => setBaseEvents(res.events));
  }, [token]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити або деактивувати цей сеанс?")) return;
    await deleteActiveEvent(token, id);
    fetchData();
  };

  return (
    <div className="p-10 space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-2xl font-bold">Календар подій</h1>

            <div className="flex gap-2">
              <select
                title="statusFilter"
                className="border p-2 rounded bg-white text-sm"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="active">Активні (Майбутні)</option>
                <option value="archived">Архів / Минулі</option>
                <option value="all">Всі статуси</option>
              </select>

              <Input
                id="search"
                label="Пошук"
                placeholder="Назва події або місто..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-64"
              />

              <Button
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
              >
                Активувати дату
              </Button>
            </div>
          </div>

          <table className="w-full border text-left">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="p-3">Дата & Час</th>
                <th className="p-3">Назва події</th>
                <th className="p-3">Локація</th>
                <th className="p-3">Місця</th>
                <th className="p-3">Ціна</th>
                <th className="p-3 text-right">Дії</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50 text-sm"
                >
                  <td className="p-3 font-medium">
                    {new Date(item.date).toLocaleDateString()} в {item.time}
                  </td>
                  <td className="p-3">
                    {baseEvents && Array.isArray(baseEvents)
                      ? baseEvents.find((event) => event._id === item.eventId)
                          ?.title[locale] || "Невідома подія"
                      : "Завантаження..."}
                  </td>
                  <td className="p-3 text-gray-600">
                    {item?.location?.city}, {item?.location?.address}
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-bold text-blue-600">
                      {item.booking}
                    </span>{" "}
                    / {item.seats}
                  </td>
                  <td className="p-3 font-bold text-green-700">
                    {item.price} €
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditing(item);
                        setModalOpen(true);
                      }}
                    >
                      ⚙️
                    </Button>
                    <Button
                      className="bg-red-500"
                      onClick={() => {
                        if (item._id) handleDelete(item._id);
                      }}
                    >
                      🗑️
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Пагінація */}
          <div className="flex justify-center gap-2 mt-4">
            <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Назад
            </Button>
            <span className="p-2">
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Редагувати сеанс" : "Активувати подію в календарі"}
            </DialogTitle>
          </DialogHeader>
          <ActiveEventForm
            baseEvents={baseEvents}
            activeEvent={editing}
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
