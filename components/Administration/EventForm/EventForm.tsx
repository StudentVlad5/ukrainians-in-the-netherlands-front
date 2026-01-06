"use client";

import { useState } from "react";
import { IEvent } from "@/helper/types/event";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "@/components/UI/Button/Button";
import Image from "next/image";
import { useTranslations } from "next-intl";

const langs = ["uk", "en", "nl", "de"] as const;

export const EventForm = ({
  event,
  onSaved,
  token,
}: {
  event: IEvent | null;
  onSaved: () => void;
  token: string | undefined;
}) => {
  const [activeLang, setActiveLang] = useState("uk");
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(event?.images || []);
  const t = useTranslations("event_admin");

  const [form, setForm] = useState({
    title: event?.title ?? { uk: "", en: "", nl: "", de: "" },
    description: event?.description ?? { uk: "", en: "", nl: "", de: "" },
    article_event: event?.article_event ?? "",
    duration: event?.duration ?? "",
    category: event?.category ?? "",
    rating: event?.rating ?? 5,
    specialistId: event?.specialistId ?? "", // Тут можна додати Select зі спеціалістами
  });

  const handleSave = async () => {
    const formData = new FormData();
    // Обов'язково пакуємо об'єкти в JSON.stringify, як того очікує ваш бекенд
    formData.append("data", JSON.stringify(form));

    imageFiles.forEach((file) => formData.append("images", file));

    try {
      setIsLoading(true);
      const url = event?._id
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/events/${event._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/events`;

      const res = await fetch(url, {
        method: event?._id ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) onSaved();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Мовні таби */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded">
        {langs.map((l) => (
          <button
            type="button"
            key={l}
            onClick={() => setActiveLang(l)}
            className={`flex-1 p-2 rounded ${
              activeLang === l ? "bg-white shadow" : ""
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <Input
        id="title"
        label={t(`Назва`)}
        value={form.title[activeLang]}
        onChange={(e) =>
          setForm({
            ...form,
            title: { ...form.title, [activeLang]: e.target.value },
          })
        }
      />

      <textarea
        className="w-full border p-2 rounded h-32"
        placeholder={`Опис (${activeLang})`}
        value={form.description[activeLang]}
        onChange={(e) =>
          setForm({
            ...form,
            description: { ...form.description, [activeLang]: e.target.value },
          })
        }
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="article_event"
          label="Артикул"
          value={form.article_event}
          onChange={(e) => setForm({ ...form, article_event: e.target.value })}
        />
        <Input
          id="duration"
          label="Тривалість"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />
        <Input
          id="category"
          label="Категорія"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <Input
          id="rating"
          label="Рейтинг (1-10)"
          type="number"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">
          Зображення (макс 3)
        </label>
        <input
          id="images"
          title="image files"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setImageFiles(files);
            setPreviews(files.map((f) => URL.createObjectURL(f)));
          }}
        />
        <div className="flex gap-2 mt-2">
          {previews.map((src, i) => (
            <Image
              key={i}
              src={src}
              width={60}
              height={60}
              className="rounded border"
              alt=""
            />
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        {isLoading ? "Зберігання..." : "Зберегти івент"}
      </Button>
    </div>
  );
};
