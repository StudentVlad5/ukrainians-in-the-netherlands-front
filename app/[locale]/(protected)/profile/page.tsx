"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "@/components/UI/Button/Button";
import Image from "next/image";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string; // Зазвичай не редагується
  avatarUrl: string;
  city: string;
  phone: string;
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const router = useRouter();

  // --- Стани (States) ---
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  // --- 1. Завантаження даних при відкритті сторінки ---
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);

      const token = Cookies.get("accessToken");

      if (!token) {
        setError("Токен не знайдено, увійдіть знову.");
        setIsLoading(false);
        router.push("/login");
        return;
      }
      try {
        const res = await fetch("/api/profile/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          if (res.status === 401) {
            Cookies.remove("accessToken");
            router.push("/login");
          }
          throw new Error(
            "Не вдалося завантажити профіль. Можливо, потрібно увійти."
          );
        }

        const data: UserProfile = await res.json();
        setFormData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Сталася помилка при завантаженні профілю.");
          if (err.message.includes("401")) {
            router.push("/login");
          }
        } else {
          setError("Невідома помилка при завантаженні профілю.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // --- 2. Обробники ---

  // Оновлення текстових полів
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Збереження текстових полів
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    const token = Cookies.get("accessToken");

    if (!token) {
      setError("Токен не знайдено, увійдіть знову.");
      setIsSaving(false);
      router.push("/login");
      return;
    }
    try {
      const res = await fetch("/api/profile/user", {
        // PUT запит
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Помилка збереження");
      }

      setFormData(data); // Оновлюємо стан новими даними (наприклад, 'fullName')
      alert(t("saveSuccess"));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Обробка файлу аватара
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // Завантаження аватара на сервер
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    const token = Cookies.get("accessToken");

    if (!token) {
      setError("Токен не знайдено, увійдіть знову.");
      router.push("/login");
      return;
    }

    setIsUploading(true);
    setError("");
    const uploadData = new FormData();
    uploadData.append("avatar", avatarFile); // "avatar" - ключ, який очікує multer

    try {
      const res = await fetch("/api/profile/avatar", {
        // POST запит
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData, // FormData сама встановить 'Content-Type: multipart/form-data'
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Помилка завантаження фото");
      }

      // Оновлюємо URL аватара в стані
      setFormData((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
      setAvatarFile(null); // Очищуємо поле вибору файлу
      alert(t("avatarSuccess"));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // --- 3. Logout ---
  const handleLogout = async () => {
    const token = Cookies.get("accessToken");

    if (token) {
      try {
        // Сповіщаємо бекенд (який теж очікує Header)
        await fetch("/api/auth/logout", {
          // /api/... (використовує rewrite)
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Failed to notify backend of logout:", error);
      }
    }
    Cookies.remove("accessToken");
    router.push("/login");
  };

  // --- 4. Рендер ---
  if (isLoading) {
    return <section className="p-10 text-center">{t("loading")}</section>;
  }

  return (
    <section className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* --- Форма Аватара --- */}
      <div className="mb-8 p-4 border rounded-md">
        <h2 className="text-xl font-semibold mb-3">{t("avatarTitle")}</h2>
        <div className="flex items-center space-x-4">
          <Image
            src={formData.avatarUrl || "/default-avatar.png"}
            alt="Avatar"
            width={200}
            height={200}
            className="w-24 h-24 rounded-full object-cover bg-gray-200"
          />
          <div>
            <Input
              id="avatarFile"
              label={"avatarLabel"}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-2"
            />
            <Button
              onClick={handleAvatarUpload}
              isLoading={isUploading}
              disabled={!avatarFile || isUploading}
            >
              {t("avatarButton")}
            </Button>
          </div>
        </div>
      </div>

      {/* --- Форма даних профілю --- */}
      <form onSubmit={handleProfileSave} className="space-y-6">
        <h2 className="text-xl font-semibold">{t("dataTitle")}</h2>

        <Input
          id="email"
          label={t("email")}
          type="email"
          value={formData.email || ""}
          disabled // Зазвичай email не дають змінювати
          readOnly
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="firstName"
            name="firstName" // 'name' важливий для handleChange
            label={t("firstName")}
            type="text"
            value={formData.firstName || ""}
            onChange={handleChange}
            disabled={isSaving}
          />
          <Input
            id="lastName"
            name="lastName"
            label={t("lastName")}
            type="text"
            value={formData.lastName || ""}
            onChange={handleChange}
            disabled={isSaving}
          />
        </div>

        <Input
          id="city"
          name="city"
          label={t("city")}
          type="text"
          value={formData.city || ""}
          onChange={handleChange}
          disabled={isSaving}
        />

        <Input
          id="phone"
          name="phone"
          label={t("phone")}
          type="tel"
          value={formData.phone || ""}
          onChange={handleChange}
          disabled={isSaving}
        />

        <Button type="submit" isLoading={isSaving} disabled={isSaving}>
          {t("saveButton")}
        </Button>
      </form>

      <hr className="my-8" />

      {/* --- Вихід --- */}
      <div className="text-center">
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:text-red-500"
        >
          {t("logout")}
        </button>
      </div>
    </section>
  );
}
