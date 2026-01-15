"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ISpecialist } from "@/helper/types/specialist";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "@/components/UI/Button/Button";
import {
  createSpecialist,
  updateSpecialist,
} from "@/helper/api/viewSpecialistData";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ILocationPlace } from "@/helper/types/locationPlace";
import { Lang } from "@/helper/types/common";
import { ICategory } from "@/helper/types/category";

const langs = ["uk", "en", "nl", "de"] as const;
const availableLanguages = ["uk", "en", "nl", "de"];

export const SpecialistForm = ({
  specialist,
  onSaved,
  category,
  token,
}: {
  specialist: ISpecialist | null;
  onSaved: () => void;
  token: string | undefined;
  category: ICategory[];
}) => {
  const [activeLang, setActiveLang] = useState<(typeof langs)[number]>("uk");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<ILocationPlace[]>([]);
  const [isLocationSelected, setIsLocationSelected] = useState(
    specialist?.location?.lat ? true : false
  );
  const [categoryInput, setCategoryInput] = useState("");

  // Файли та прев'ю
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    specialist?.imageUrl || ""
  );
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>(
    specialist?.portfolio || []
  );
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<Partial<ISpecialist>>({
    name: specialist?.name ?? { uk: "", en: "", nl: "", de: "" },
    specialty: specialist?.specialty ?? { uk: "", en: "", nl: "", de: "" },
    education: specialist?.education ?? { uk: "", en: "", nl: "", de: "" },
    description: specialist?.description ?? { uk: "", en: "", nl: "", de: "" },
    email: specialist?.email ?? "",
    phone: specialist?.phone ?? "",
    rating: specialist?.rating ?? 0,
    instagram: specialist?.instagram ?? "",
    telegram: specialist?.telegram ?? "",
    whatsapp: specialist?.whatsapp ?? "",
    minOrder: specialist?.minOrder ?? "", // тепер обробляємо як число або рядок з валютою
    languages: specialist?.languages ?? [],
    location: specialist?.location ?? { address: "", lat: 0, lng: 0 },
    isActive: specialist?.isActive ?? false,
    category: specialist?.category ?? "",
  });

  const t = useTranslations("add_specialist");
  const locale = useLocale() as Lang;

  // Валідація Email (регулярний вираз)
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // 1. Обробник введення тексту
  const handleAddressChange = (address: string) => {
    setForm((prev) => ({ ...prev, location: { ...prev.location!, address } }));
    setSearchTerm(address); // Оновлюємо термін для пошуку
    setIsLocationSelected(false); // Скидаємо вибір
    setErrors((prev) => ({ ...prev, location: "" }));
  };

  // 2. Ефект для пошуку з затримкою
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2 && !isLocationSelected) {
        setIsGeocoding(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              searchTerm
            )}&limit=5&accept-language=${locale}`
          );
          const data = await res.json();
          setSuggestions(data);
        } catch (e) {
          console.error("Geocoding error:", e);
        } finally {
          setIsGeocoding(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500); // Затримка 500 мс

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isLocationSelected, locale]);

  // 3. Функція вибору
  const handleSelectLocation = (item: ILocationPlace) => {
    setForm((prev) => ({
      ...prev,
      location: {
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      },
    }));
    setSearchTerm(item.display_name);
    setIsLocationSelected(true);
    setSuggestions([]);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name?.[activeLang])
      newErrors.name = t("Please enter a name for the current language");
    if (!validateEmail(form.email || ""))
      newErrors.email = t("Enter a valid email address");
    if (!form.phone || form.phone.length < 9)
      newErrors.phone = t("Enter a valid phone number");
    if (!form.location?.lat || form.location?.lat === 0)
      newErrors.location = t("Need to find city to get coordinates");
    if (!form.minOrder)
      newErrors.minOrder = t("Indicate the amount of the minimum order");
    if (!form.rating) newErrors.rating = t("Indicate a rating from 0 to 5");
    if (!form.category) newErrors.rating = t("Chose the category");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    if (!isLocationSelected) {
      setErrors((prev) => ({
        ...prev,
        location: t("Будь ласка, оберіть адресу зі списку"),
      }));
      return;
    }
    const formData = new FormData();
    // 1. Складні об'єкти додаємо як JSON
    [
      "name",
      "specialty",
      "education",
      "description",
      "location",
      "languages",
    ].forEach((key) => {
      formData.append(key, JSON.stringify(form[key as keyof ISpecialist]));
    });

    // 2. Прості поля додаємо ЯК Є (без JSON.stringify, щоб не було зайвих лапок)
    formData.append("email", form.email || "");
    formData.append("phone", form.phone || "");
    formData.append("instagram", form.instagram || "");
    formData.append("telegram", form.telegram || "");
    formData.append("whatsapp", form.whatsapp || "");
    formData.append("minOrder", String(form.minOrder));
    formData.append("rating", String(form.rating));
    formData.append("category", form.category || "");

    if (avatar) formData.append("imageUrl", avatar);
    portfolioFiles.forEach((file) => formData.append("portfolio", file));

    if (avatar) formData.append("imageUrl", avatar);
    portfolioFiles.forEach((file) => formData.append("portfolio", file));

    try {
      setIsLoading(true);
      if (specialist?._id) {
        await updateSpecialist(token!, specialist._id, formData);
      } else {
        await createSpecialist(token!, formData);
      }
      onSaved();
    } catch (e) {
      console.log(e);
      setErrors((prev) => ({
        ...prev,
        global: t("Error saving to server"),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const ErrorMsg = ({ field }: { field: string }) => (
    <AnimatePresence mode="wait">
      {errors[field] && (
        <motion.p
          initial={{ height: 0, opacity: 0, y: -5 }}
          animate={{ height: "auto", opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0 }}
          className="text-red-500 text-xs mt-1 font-medium"
        >
          {errors[field]}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6 bg-white border rounded-2xl shadow-xl text-gray-800">
      {/* Мовні перемикачі */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        {langs.map((l) => (
          <button
            type="button"
            key={l}
            onClick={() => setActiveLang(l)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeLang === l
                ? "bg-white shadow text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Фото прев'ю */}
      <div className="flex flex-col md:flex-row gap-6 bg-gray-50 p-4 rounded-xl border">
        <div className="flex-1 space-y-2 cursor-pointer">
          <label
            htmlFor="avatarPreview"
            className="text-sm font-bold block cursor-pointer"
          >
            {t("Profile photo")} (Avatar)
          </label>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden border">
              {avatarPreview && (
                <Image
                  width="56"
                  height="56"
                  src={avatarPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <input
              id="avatarPreview"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAvatar(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }
              }}
              className="text-xs cursor-pointer"
            />
          </div>
        </div>
        <div className="flex-1 space-y-2 cursor-pointer">
          <label
            htmlFor="portfolioPreviews"
            className="text-sm font-bold block cursor-pointer"
          >
            {t("Portfolio")} (Files)
          </label>
          <input
            id="portfolioPreviews"
            title="portfolioPreviews"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setPortfolioFiles(files);
              setPortfolioPreviews(files.map((f) => URL.createObjectURL(f)));
            }}
            className="text-xs cursor-pointer"
          />
          <div className="flex gap-1 mt-2 flex-wrap">
            {portfolioPreviews.slice(0, 5).map((url, i) => (
              <Image
                key={i}
                alt="portfolio Previews"
                src={url}
                width="56"
                height="56"
                className="w-8 h-8 object-cover rounded shadow-sm"
              />
            ))}
            {portfolioPreviews.length > 5 && (
              <span className="text-xs text-gray-400">
                +{portfolioPreviews.length - 5}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Основна інформація */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="col-span-2">
          <Input
            id="name"
            label={`${t("Full name")} (${activeLang})`}
            value={form.name?.[activeLang]}
            onChange={(e) =>
              setForm({
                ...form,
                name: { ...form.name!, [activeLang]: e.target.value },
              })
            }
          />
          <ErrorMsg field="name" />
        </div>

        <Input
          id="specialty"
          label={t("Specialty")}
          value={form.specialty?.[activeLang]}
          onChange={(e) =>
            setForm({
              ...form,
              specialty: { ...form.specialty!, [activeLang]: e.target.value },
            })
          }
        />
        <Input
          id="education"
          label={t("Education")}
          value={form.education?.[activeLang]}
          onChange={(e) =>
            setForm({
              ...form,
              education: { ...form.education!, [activeLang]: e.target.value },
            })
          }
        />

        <div className="col-span-2">
          <label htmlFor="description" className="text-sm font-bold block mb-1">
            {t("Profile description")} ({activeLang})
          </label>
          <textarea
            id="description"
            title="description"
            className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
            value={form.description?.[activeLang]}
            onChange={(e) =>
              setForm({
                ...form,
                description: {
                  ...form.description!,
                  [activeLang]: e.target.value,
                },
              })
            }
          />
        </div>

        <div>
          <Input
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <ErrorMsg field="email" />
        </div>
        <div>
          <Input
            id="phone"
            label={t("Phone")}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <ErrorMsg field="phone" />
        </div>
      </div>

      {/* Соцмережі та фінанси */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="telegram"
          label="Telegram (@username)"
          value={form.telegram}
          onChange={(e) => setForm({ ...form, telegram: e.target.value })}
        />
        <Input
          id="whatsapp"
          label="WhatsApp"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        />
        <Input
          id="instagram"
          label="Instagram"
          value={form.instagram}
          onChange={(e) => setForm({ ...form, instagram: e.target.value })}
        />
        <div>
          <Input
            id="minOrder"
            label={t("order")}
            placeholder="напр. 50"
            value={form.minOrder}
            onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
          />
          <ErrorMsg field="minOrder" />
        </div>
        <div>
          <Input
            id="rating"
            label={t("Rating")}
            type="number"
            min="0"
            max="5"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
          />
          <ErrorMsg field="rating" />
        </div>
        <div>
          <Input
            id="category"
            label={t("Category")}
            list="category-list"
            value={categoryInput}
            onChange={(e) => {
              const value = e.target.value;
              setCategoryInput(value);
              const selected = category.find((c) => c.title[locale] === value);
              if (selected) {
                setForm((prev) => ({
                  ...prev,
                  category: selected._id,
                }));
              }
            }}
          />

          <datalist id="category-list">
            {category.map((c) => (
              <option key={c._id} value={c.title[locale]} />
            ))}
          </datalist>

          <ErrorMsg field="category" />
        </div>
      </div>

      {/* Локація з поясненням */}
      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 relative">
        <label className="text-sm font-bold block mb-1">
          {t("City and Country")}
        </label>
        <div className="relative">
          <input
            className={`w-full p-2 border rounded-lg text-sm pr-10 ${
              errors.location ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("Enter a city (eg Amsterdam, NL)")}
            value={form.location?.address || ""}
            onChange={(e) => handleAddressChange(e.target.value)}
          />

          {/* Індикатор завантаження всередині інпуту */}
          {isGeocoding && (
            <div className="absolute right-3 top-2.5 animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          )}

          {/* Випадаючий список результатів */}
          {suggestions.length > 0 && (
            <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-b-lg shadow-xl mt-1 max-h-48 overflow-y-auto">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors border-b last:border-none"
                  onClick={() => handleSelectLocation(item)}
                >
                  <p className="font-medium text-gray-700 truncate">
                    {item.display_name}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <ErrorMsg field="location" />
        {!form.location?.lat && !errors.location && (
          <p className="text-[10px] text-blue-600 mt-1 italic">
            {t("map message")}
          </p>
        )}
      </div>

      {/* Мови */}
      <div className="flex justify-around py-3 border-t">
        <h6>{t("My languages")} </h6>
        {availableLanguages.map((lang) => (
          <label
            key={lang}
            className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase"
          >
            <input
              type="checkbox"
              checked={form.languages?.includes(lang)}
              onChange={() => {
                const cur = form.languages || [];
                setForm({
                  ...form,
                  languages: cur.includes(lang)
                    ? cur.filter((l) => l !== lang)
                    : [...cur, lang],
                });
              }}
            />
            {lang}
          </label>
        ))}
      </div>
      <div className="flex justify-around py-3 border-t">
        <h6>{t("IsActive")} </h6>
        <label
          htmlFor="isActive"
          className="flex items-center gap-2 cursor-pointer text-xs font-bold"
        >
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={() => {
              setForm({
                ...form,
                isActive: !form.isActive,
              });
            }}
          />{" "}
          isActive
        </label>
      </div>

      <Button
        disabled={isLoading || !isLocationSelected}
        onClick={save}
        className="w-full py-4 rounded-xl text-lg font-extrabold shadow-blue-200 shadow-lg"
      >
        {t("Save changes")}
      </Button>
    </div>
  );
};
