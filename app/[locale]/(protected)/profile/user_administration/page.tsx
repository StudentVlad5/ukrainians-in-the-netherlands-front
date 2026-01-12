"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/UI/Card/card";
import { Button } from "@/components/UI/Button/Button";
import { Input } from "@/components/UI/Input/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/Dialog/dialog";
import { UserForm } from "@/components/Administration/UserForm/UserForm";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { UserProfile } from "@/helper/types/userData";

export default function UsersAdministrationPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const t = useTranslations("admin");
  const token = Cookies.get("accessToken");

  useEffect(() => {
    if (!token) return;
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users?page=${page}&search=${search}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [page, search, token]);

  const openEdit = (user: UserProfile) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const deleteUser = async (id: string) => {
    if (!confirm(t("Are you sure?"))) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPage(1);
  };

  return (
    <div className="p-10">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t("Users Management")}</h1>
            <Input
              label="search"
              id="search"
              placeholder={t("Search users...")}
              className="max-w-xs"
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">{t("Full Name")}</th>
                <th className="p-3 border text-left">{t("Email")}</th>
                <th className="p-3 border text-left">{t("Role")}</th>
                <th className="p-3 border text-center">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: UserProfile) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="p-3 border font-medium">{user.fullName}</td>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border text-xs uppercase font-bold text-gray-600">
                    {user.role}
                  </td>
                  <td className="p-3 border text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        onClick={() => openEdit(user)}
                        variant="secondary"
                        className="h-8 px-3 text-xs"
                      >
                        {t("Edit")}
                      </Button>
                      <Button
                        onClick={() => {
                          if (user?._id) deleteUser(user?._id);
                        }}
                        variant="danger"
                        className="h-8 px-3 text-xs bg-red-500"
                      >
                        {t("Delete")}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Пагінація аналогічна до попереднього прикладу */}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Edit User Information")}</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm
              initialData={editingUser}
              token={token}
              onSaved={() => {
                setModalOpen(false);
                setSearch("");
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
