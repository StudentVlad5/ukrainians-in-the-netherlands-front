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
import { DeleteUserData, getAllUsers } from "@/helper/api/viewUsersData";

export default function UsersAdministrationPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFatch, setIsFatch] = useState(false);

  const t = useTranslations("manage_users");
  const token = Cookies.get("accessToken");

  useEffect(() => {
    if (!token) return;
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token, page, search);
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setIsFatch(false);
      } catch (error) {
        console.log(error);
      }
    };
    if ((!isModalOpen && (search === "" || search.length > 3)) || isFatch)
      fetchUsers();
  }, [page, search, token, isModalOpen, isFatch]);

  const openEdit = (user: UserProfile) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const deleteUser = async (id: string) => {
    if (!confirm(t("Are you sure?"))) return;
    await DeleteUserData(token, id);
    setIsFatch(true);
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
              placeholder={t("Search users") + "..."}
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
                <th className="p-3 border text-left">{t("Status")}</th>
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
                  <td className="p-3 border text-xs uppercase font-bold text-gray-600">
                    {user.status}
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

          {/* Блок пагінації */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              {t("Page")} {page} {t("of")} {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                {t("Previous")}
              </Button>
              <Button
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                {t("Next")}
              </Button>
            </div>
          </div>
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
