"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { INews } from "@/helper/types/news";
import { Button } from "@/components/UI/Button/Button";
import { useState, ChangeEvent } from "react";
import { MultilangString } from "@/helper/types/common";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { saveNews } from "@/helper/api/viewNewsData";

interface Props {
  initialData?: INews | null;
  token?: string;
  onSaved: () => void;
}

const LANGUAGES: (keyof MultilangString)[] = ["uk", "en", "nl", "de"];

export function NewsForm({ initialData, token, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof MultilangString>("uk");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const t = useTranslations("news_admin");

  const { register, control, handleSubmit, watch, setValue } = useForm<INews>({
    defaultValues: initialData || {
      date: new Date().toISOString().split("T")[0],
      category: { uk: "", en: "", nl: "", de: "" },
      imageUrl: "",
      sourceUrl: "",
      isActive: true,
      slug: "",
      title: { uk: "", en: "", nl: "", de: "" },
      shortDescription: { uk: "", en: "", nl: "", de: "" },
      paragraphs: [
        {
          title: { uk: "", en: "", nl: "", de: "" },
          body: { uk: "", en: "", nl: "", de: "" },
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "paragraphs",
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const generateSlug = () => {
    const titleEn = watch("title.en");
    if (titleEn) {
      const slug = titleEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slug);
    }
  };

  const onSubmit = async (data: INews) => {
    if (!token) return;
    setLoading(true);

    const formData = new FormData();
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    formData.append("data", JSON.stringify(data));

    try {
      await saveNews(token, formData);
      console.log("Sending FormData with file and data:", data);
      onSaved();
    } catch (error) {
      console.error("Error saving news:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* МЕТА-ДАНІ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 cursor-default">
            {t("Date")}
          </label>
          <input
            type="date"
            {...register("date")}
            className="w-full border p-2 rounded cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 cursor-default">
            Slug (URL)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              {...register("slug")}
              className="w-full border p-2 rounded bg-white"
              placeholder="my-news-article"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={generateSlug}
              className="text-xs cursor-pointer"
            >
              Auto
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="file"
            className="text-xs font-bold uppercase text-gray-500 cursor-default"
          >
            {t("Image")}
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-1 rounded bg-white cursor-pointer file:cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 cursor-default">
            {t("Official Source")} (URL)
          </label>
          <input
            type="url"
            {...register("sourceUrl")}
            className="w-full border p-2 rounded"
            placeholder="https://official-source.com"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <div className="flex bg-gray-100 border-b">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveTab(lang)}
              className={`px-6 py-3 text-sm font-bold uppercase transition-colors cursor-pointer ${
                activeTab === lang
                  ? "bg-white border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="p-6 bg-white space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-400">
                {t("Category")} ({activeTab})
              </label>
              <input
                type="text"
                {...register(`category.${activeTab}`)}
                className="w-full border p-2 rounded"
                placeholder={t("Shares")}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-400">
                {t("Title")} ({activeTab})
              </label>
              <input
                {...register(`title.${activeTab}`)}
                className="w-full border p-2 rounded font-semibold"
                placeholder={`${t("Enter a title")}...`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-400">
              {t("Brief description")}
            </label>
            <textarea
              {...register(`shortDescription.${activeTab}`)}
              className="w-full border p-2 rounded h-20 resize-none"
              placeholder={`${t("News announcement")}...`}
            />
          </div>

          {/* ПАРАГРАФИ */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider">
              {t("Article paragraphs")}
            </h3>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-5 border-2 border-dashed border-gray-200 rounded-xl bg-white relative group transition-all hover:border-blue-200"
              >
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-lg cursor-pointer z-10"
                  title="remove paragraph"
                >
                  <X size={18} />
                </button>

                <div className="space-y-3">
                  <input
                    placeholder={`${t("Paragraph subtitle")} (${activeTab})`}
                    {...register(`paragraphs.${index}.title.${activeTab}`)}
                    className="w-full border-b border-gray-100 p-2 focus:border-blue-500 outline-none font-medium transition-colors"
                  />
                  <textarea
                    placeholder={`${t("Main text")} (${activeTab})...`}
                    {...register(`paragraphs.${index}.body.${activeTab}`)}
                    className="w-full border p-3 rounded-lg h-32 text-sm bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 border rounded-lg">
        <Button
          type="button"
          variant="secondary"
          className="border-2 px-6 py-2 h-auto text-sm cursor-pointer hover:bg-gray-100"
          onClick={() =>
            append({
              title: { uk: "", en: "", nl: "", de: "" },
              body: { uk: "", en: "", nl: "", de: "" },
            })
          }
        >
          + {t("Add a paragraph")}
        </Button>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("isActive")}
              className="w-4 h-4 cursor-pointer"
            />
            {t("Publish")}
          </label>
          <Button
            type="submit"
            disabled={loading}
            className="px-10 py-2 cursor-pointer shadow-md"
          >
            {loading ? t("Loading") + "..." : t("Save") + "..."}
          </Button>
        </div>
      </div>
    </form>
  );
}
