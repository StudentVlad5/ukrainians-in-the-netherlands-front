"use client";
import { useState } from "react";
import { Button } from "@/components/UI/Button/Button";
import { Input } from "@/components/UI/Input/Input"; // Ваш кастомний інпут
import { useTranslations } from "next-intl";
import { UserProfile } from "@/helper/types/userData";

interface UserFormProps {
  initialData?: UserProfile;
  token?: string;
  onSaved: () => void;
}

export function UserForm({ initialData, token, onSaved }: UserFormProps) {
  const t = useTranslations("admin");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    role: initialData?.role || "user",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!initialData?._id || !token) return;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${initialData._id}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) onSaved();
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="FirstName" className="text-sm font-medium">
            {t("First Name")}
          </label>
          <Input
            id="FirstName"
            label="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            {t("Last Name")}
          </label>
          <Input
            id="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t("Email")}
        </label>
        <Input
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("Role")}</label>
        <select
          title="Role"
          className="w-full p-2 border rounded-md"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="submit" disabled={loading}>
          {loading ? t("Saving...") : t("Save Changes")}
        </Button>
      </div>
    </form>
  );
}
