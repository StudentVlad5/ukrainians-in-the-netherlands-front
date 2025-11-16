import { useState, ChangeEvent } from "react";
import { Textarea } from "@/components/UI/Textarea/textarea";
import { defaultFormState, IProduct, ITranslatableString } from "../types";
import Cookies from "js-cookie";
import { SaveDataProduct } from "@/helper/api/viewProductData";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "@/components/UI/Button/Button";

export function ProductForm({
  product,
  onClose,
}: {
  product: IProduct | null;
  onClose: () => void;
}) {
  // FIX: Ініціалізуємо стан З defaultFormState, а НЕ 'product'
  const [form, setForm] = useState<IProduct>(
    product ? product : defaultFormState
  );
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleChange = (
    lang: keyof ITranslatableString,
    field: "title" | "description",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  // FIX: Універсальний обробник для простих полів
  const handleSimpleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3);
      setNewImages(files);
    }
  };

  const handleSave = async () => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const formData = new FormData();
        formData.append("data", JSON.stringify(form));
        newImages.forEach((img) => formData.append("images", img));
        await SaveDataProduct(token, product, formData);
        onClose();
      } catch (error) {
        console.error("Failed to save product:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Translatable fields */}
      <h3 className="font-semibold">Title (Multilingual)</h3>
      <div className="grid grid-cols-2 gap-4">
        {(["uk", "nl", "de", "en"] as const).map((lang) => (
          <Input
            key={lang}
            id={`title-${lang}`}
            label={`Title (${lang})`}
            className="sr-only"
            placeholder={`Title (${lang})`}
            value={form.title[lang]}
            onChange={(e) => handleChange(lang, "title", e.target.value)}
          />
        ))}
      </div>

      <h3 className="font-semibold">Description (Multilingual)</h3>
      <div className="grid grid-cols-2 gap-4">
        {(["uk", "nl", "de", "en"] as const).map((lang) => (
          <Textarea
            key={lang}
            id={`desc-${lang}`} // FIX: Додано id
            placeholder={`Description (${lang})`}
            value={form.description[lang]}
            onChange={(e) => handleChange(lang, "description", e.target.value)}
          />
        ))}
      </div>

      <hr />

      {/* Other fields */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="category"
          name="category"
          label="Category"
          placeholder="Category"
          value={form.category}
          onChange={handleSimpleChange}
        />
        <Input
          id="price"
          name="price"
          label="Price (€)"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <Input
          id="city"
          name="city"
          label="City"
          placeholder="City"
          value={form.location.city}
          onChange={(e) =>
            setForm({
              ...form,
              location: { ...form.location, city: e.target.value },
            })
          }
        />

        <div>
          <label
            htmlFor="condition"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Condition
          </label>
          <select
            id="condition"
            name="condition"
            className="border p-2 rounded w-full h-[42px]"
            value={form.condition}
            onChange={handleSimpleChange}
          >
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Images (Max 3)
        </label>
        <input
          title="image"
          type="file"
          multiple
          accept="image/*"
          onChange={handleUploadImages}
          className="w-full"
        />
      </div>

      <Button onClick={handleSave} className="w-full">
        Save
      </Button>
    </div>
  );
}
