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
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

import { IOrder, IOrdersResponse } from "@/helper/types/orders";
import { refreshUserProfile } from "@/helper/api/viewProfileData";
import { getAllOrders } from "@/helper/api/viewOrdersData";
import type { Lang } from "@/helper/types/common";

export default function OrdersDashboardPage() {
  const [items, setItems] = useState<IOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState("");

  const router = useRouter();
  const token = Cookies.get("accessToken");
  const t = useTranslations("orders"); // Переконайтеся, що цей розділ є у файлах перекладу
  const locale = useLocale() as Lang;

  const limit = 10;

  // Перевірка прав доступу
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const data = await refreshUserProfile(token);
        if (data.role !== "seller" && data.role !== "admin") {
          router.push("/profile");
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router, token]);

  // Завантаження даних замовлень
  const fetchData = useCallback(async () => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    setIsLoading(true);
    try {
      const response: IOrdersResponse = await getAllOrders(token, page, limit);
      setItems(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openDetails = (item: IOrder) => {
    setSelectedOrder(item);
    setModalOpen(true);
  };

  return (
    <div className="p-10">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex justify-between gap-2">
            <h1 className="text-2xl font-bold">{t("Orders Management")}</h1>
          </div>

          <table className="w-full border text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">{t("Event")}</th>
                <th className="p-2 text-left">{t("Amount")}</th>
                <th className="p-2 text-left">{t("Status")}</th>
                <th className="p-2 text-left">{t("Date")}</th>
                <th className="p-2 text-center">{t("Actions")}</th>
              </tr>
            </thead>
            {!isLoading && (
              <tbody>
                {items.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="p-2 text-sm">...{order._id.slice(-6)}</td>
                    <td className="p-2">
                      {order.eventId?.title?.[locale] ?? t("N/A")}
                    </td>
                    <td className="p-2 font-semibold">
                      {order.totalAmount} UAH
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {t(order.status)}
                      </span>
                    </td>
                    <td className="p-2 text-sm">
                      {new Date(order.createdAt).toLocaleDateString(locale)}
                    </td>
                    <td className="p-2 text-center">
                      <Button
                        variant="secondary"
                        onClick={() => openDetails(order)}
                      >
                        {t("View Details")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>

          {/* Пагінація */}
          <div className="flex justify-center gap-4 mt-4">
            <Button
              disabled={page === 1 || isLoading}
              onClick={() => setPage((p) => p - 1)}
            >
              {t("Prev")}
            </Button>
            <span className="flex items-center">
              {t("Page")} {page} / {Math.ceil(total / limit)}
            </span>
            <Button
              disabled={page * limit >= total || isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              {t("Next")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* MODAL для деталей замовлення */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("Order Details")}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">{t("Order ID")}</p>
                  <p className="font-mono">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("Status")}</p>
                  <p className="font-bold uppercase">{selectedOrder.status}</p>
                </div>
              </div>
              {/* Тут можна додати детальну інформацію про квитки або покупця */}
              <div className="text-right">
                <p className="text-lg font-bold">
                  {t("Total")}: {selectedOrder.totalAmount} UAH
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
