"use client";

import { useState } from "react";
import { ICategory } from "@/helper/types/category";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "@/components/UI/Button/Button";
import { Lang } from "@/helper/types/common";
import { saveCategory } from "@/helper/api/viewCategoriesData";

interface Props {
  category: ICategory | null;
  onSaved: () => void;
  token?: string;
}

export const CategoryForm = ({ category, onSaved, token }: Props) => {
  const [activeLang, setActiveLang] = useState<Lang>("uk");
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<Partial<ICategory>>({
    title: category?.title ?? { uk: "", en: "", nl: "", de: "" },
  });

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (category && category._id) form._id = category._id;
      const res = await saveCategory(token, form);
      if (res) onSaved();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        {(["uk", "en", "nl", "de"] as Lang[]).map((l) => (
          <button
            type="button"
            key={l}
            onClick={() => setActiveLang(l)}
            className={`flex-1 py-1.5 text-xs font-bold rounded ${
              activeLang === l
                ? "bg-white shadow text-blue-600"
                : "text-gray-500"
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Input
          id="title"
          label={`Назва категорії (${activeLang.toUpperCase()})`}
          value={form.title?.[activeLang]}
          onChange={(e) =>
            setForm({
              ...form,
              title: { ...form.title!, [activeLang]: e.target.value },
            })
          }
        />
      </div>

      <Button onClick={handleSave} disabled={isLoading} className="w-full h-12">
        {isLoading ? "Збереження..." : "Зберегти категорію"}
      </Button>
    </div>
  );
};
