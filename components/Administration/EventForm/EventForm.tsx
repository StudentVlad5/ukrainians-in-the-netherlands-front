"use client";

import { useEffect, useState } from "react";
import { IEvent } from "@/helper/types/event";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "@/components/UI/Button/Button";
import { useLocale } from "next-intl";
import { SaveEvent } from "@/helper/api/viewEventsData";
import { ITranslatableString } from "@/helper/types/category";
import Image from "next/image";

const langs = ["uk", "en", "nl", "de"] as const;

export const EventForm = ({
  event,
  onSaved,
  token,
  specialists,
  categories,
  userRole,
}: {
  event: IEvent | null;
  onSaved: () => void;
  token?: string;
  specialists: { _id: string; name: string | ITranslatableString }[];
  categories: { _id: string; title: string | ITranslatableString }[];
  userRole: string;
}) => {
  const locale = useLocale() as keyof ITranslatableString;

  const [form, setForm] = useState({
    title: event?.title ?? { uk: "", en: "", nl: "", de: "" },
    description: event?.description ?? { uk: "", en: "", nl: "", de: "" },
    article_event: event?.article_event ?? "",
    duration: event?.duration ?? "",
    category: event?.category ?? "",
    rating: event?.rating ?? 5,
    specialistId: event?.specialistId ?? "",
  });
  const [activeLang, setActiveLang] = useState<(typeof langs)[number]>("uk");
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(event?.images || []);

  // 🔹 auto specialist for seller
  useEffect(() => {
    if (
      userRole === "seller" &&
      specialists.length === 1 &&
      !form.specialistId
    ) {
      setForm((p) => ({ ...p, specialistId: specialists[0]._id }));
    }
  }, [userRole, specialists, form.specialistId]);

  const handleSave = async () => {
    const valid = langs.every((l) => form.title[l]?.trim());
    if (!valid) return alert("Заповніть назву на всіх мовах");
    if (!form.category) return alert("Оберіть категорію");
    if (!form.specialistId) return alert("Оберіть спеціаліста");

    const fd = new FormData();
    fd.append("data", JSON.stringify(form));
    imageFiles.forEach((file) => fd.append("images", file));

    try {
      setIsLoading(true);
      await SaveEvent(token, event, fd);
      onSaved();
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
            className={`flex-1 p-2 rounded transition ${
              activeLang === l ? "bg-white shadow" : "hover:bg-gray-200"
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <Input
        id="title"
        label={`Назва (${activeLang.toUpperCase()})`}
        value={form.title[activeLang]}
        onChange={(e) =>
          setForm({
            ...form,
            title: { ...form.title, [activeLang]: e.target.value },
          })
        }
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          Опис ({activeLang.toUpperCase()})
        </label>
        <textarea
          className="w-full border p-2 rounded h-32 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Введіть опис..."
          value={form.description[activeLang]}
          onChange={(e) =>
            setForm({
              ...form,
              description: {
                ...form.description,
                [activeLang]: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="article_event"
          label="Артикул"
          value={form.article_event}
          onChange={(e) => setForm({ ...form, article_event: e.target.value })}
        />

        {/* Вибір категорії */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold">Категорія</label>
          <select
            title="category"
            className="border p-2 rounded h-[42px]"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Оберіть категорію</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {typeof cat.title === "object" ? cat.title[locale] : cat.title}
              </option>
            ))}
          </select>
        </div>

        <Input
          id="duration"
          label="Тривалість"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />

        <Input
          id="rating"
          label="Рейтинг (1-10)"
          type="number"
          min={1}
          max={10}
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        />
      </div>

      {/* Вибір спеціаліста */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold">Спеціаліст</label>
        <select
          title="specialists"
          className="border p-2 rounded"
          value={form.specialistId}
          onChange={(e) => setForm({ ...form, specialistId: e.target.value })}
          disabled={userRole === "seller" && specialists.length <= 1}
        >
          <option value="">Оберіть спеціаліста</option>
          {specialists.map((spec) => (
            <option key={spec._id} value={spec._id}>
              {typeof spec.name === "object" ? spec.name[locale] : spec.name}
            </option>
          ))}
        </select>
        {userRole === "seller" && (
          <p className="text-xs text-gray-500">
            Ви можете додавати івенти лише для своїх спеціалістів
          </p>
        )}
      </div>

      {/* Зображення */}
      <div>
        <label className="block text-sm font-bold mb-2">
          Зображення (макс 3)
        </label>
        <input
          title="images"
          type="file"
          multiple
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(e) => {
            const files = Array.from(e.target.files || []).slice(0, 3);
            setImageFiles(files);
            setPreviews(files.map((f) => URL.createObjectURL(f)));
          }}
        />
        <div className="flex gap-2 mt-2">
          {previews.map((src, i) => (
            <div key={i} className="relative w-[60px] h-[60px]">
              <Image
                src={src}
                fill
                className="rounded border object-cover"
                alt="preview"
              />
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "Збереження..." : "Зберегти"}
      </Button>
    </div>
  );
};
