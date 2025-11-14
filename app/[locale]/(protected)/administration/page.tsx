"use client";
import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Card, CardContent } from "@/components/UI/Card/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/Dialog/dialog";
import { Textarea } from "@/components/UI/Textarea/textarea";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "@/components/UI/Button/Button";
import Image from "next/image";

// --- Types -----------------------------------------------------------
export interface ITranslatableString {
  uk: string;
  nl: string;
  de: string;
  en: string;
}

export interface IProduct {
  _id: string;
  user: string;
  title: ITranslatableString;
  description: ITranslatableString;
  price: number;
  category: string;
  tags: string[];
  images: string[];
  status: "active" | "inactive";
  location: {
    city: string;
    postalCode?: string;
    address?: string;
  };
  condition: "new" | "used";
  createdAt: string;
  updatedAt: string;
}

// FIX: Стан за замовчуванням для форми створення
// Це запобігає помилкам, коли 'product' === null
const defaultFormState: IProduct = {
  _id: "",
  user: "",
  title: { uk: "", nl: "", de: "", en: "" },
  description: { uk: "", nl: "", de: "", en: "" },
  price: 0,
  category: "",
  tags: [],
  images: [],
  status: "active",
  location: { city: "", postalCode: "", address: "" },
  condition: "new",
  createdAt: "",
  updatedAt: "",
};

// --- Main Page -------------------------------------------------------
export default function ProductsDashboardPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/products?page=${page}&search=${search}&category=${category}&status=${status}&city=${city}`
      );
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  }, [page, search, category, status, city]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchProducts();
      console.log(data);
    };
    loadData();
  }, [fetchProducts]);

  function openEdit(p: IProduct) {
    setEditingProduct(p);
    setModalOpen(true);
  }

  const openCreate = () => {
    setEditingProduct(null); // Передаємо null, форма впорається
    setModalOpen(true);
  };

  // FIX: Додаємо обробник для оновлення списку після збереження
  const handleFormSave = () => {
    setModalOpen(false);
    fetchProducts(); // Оновлюємо список
  };

  return (
    <div className="p-10 w-full">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Products</h1>
            <Button onClick={openCreate}>Add Product</Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* FIX: Додані 'id' та 'label' до ваших кастомних Input'ів */}
            <Input
              id="search"
              label="Search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Input
              id="category"
              label="Category"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Input
              id="city"
              label="City"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {/* FIX: Додано <label> та 'id' для <select> для доступності */}
            <div className="flex flex-col">
              <label
                htmlFor="status-select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status-select"
                className="border p-2 rounded w-full h-[42px]" // h-[42px] для вирівнювання з інпутами
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Image</th>
                  <th className="p-2">Title (UK)</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">City</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="p-2">
                      {p.images?.[0] && (
                        <Image
                          src={p.images[0]}
                          width={60}
                          height={60}
                          alt={p.title.uk || "Product thumbnail"}
                          className="rounded"
                        />
                      )}
                    </td>
                    <td className="p-2 font-semibold">{p.title.uk}</td>
                    <td className="p-2">{p.category}</td>
                    <td className="p-2">€{p.price}</td>
                    <td className="p-2">{p.location.city}</td>
                    <td className="p-2">{p.status}</td>
                    <td className="p-2 space-x-2">
                      {/* FIX: Видалено 'size' (не підтримується) */}
                      <Button onClick={() => openEdit(p)}>Edit</Button>
                      {/* FIX: Видалено 'size' та 'variant', додано 'className' для стилізації */}
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        // onClick={() => handleDelete(p._id)} // TODO: Додати функцію
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 pt-4">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </Button>
            <span className="py-2">
              Page {page} / {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {" "}
          {/* FIX: Обмеження висоти і скрол */}
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Create Product"}
            </DialogTitle>
          </DialogHeader>
          {/* Multilingual Form */}
          <ProductForm
            key={editingProduct?._id || "new"}
            product={editingProduct}
            onClose={handleFormSave} // FIX: Використовуємо новий обробник
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Product Form ----------------------------------------------------
function ProductForm({
  product,
  onClose,
}: {
  product: IProduct | null;
  onClose: () => void;
}) {
  // FIX: Ініціалізуємо стан З defaultFormState, а НЕ 'product'
  const [form, setForm] = useState<IProduct>(defaultFormState);
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleChange = (
    lang: keyof ITranslatableString,
    field: "title" | "description",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev, // 'prev' тепер гарантовано не 'null'
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
    // TODO: Додати логіку валідації
    const formData = new FormData();

    // FIX: Відправляємо 'form' а не 'product'
    formData.append("data", JSON.stringify(form));
    newImages.forEach((img) => formData.append("images", img));

    await fetch(`/api/products${product ? `/${product._id}` : ""}`, {
      method: product ? "PUT" : "POST",
      body: formData,
    });
    // TODO: Додати обробку помилок

    onClose();
  };

  return (
    <div className="space-y-4">
      {/* Translatable fields */}
      <h3 className="font-semibold">Title (Multilingual)</h3>
      <div className="grid grid-cols-2 gap-4">
        {(["uk", "nl", "de", "en"] as const).map((lang) => (
          // FIX: Додані 'id' та 'label' (зробимо його sr-only для чистоти)
          <Input
            key={lang}
            id={`title-${lang}`}
            label={`Title (${lang})`}
            className="sr-only"
            placeholder={`Title (${lang})`}
            value={form.title[lang]} // FIX: 'form' ніколи не 'null'
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
            value={form.description[lang]} // FIX: 'form' ніколи не 'null'
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

      {/* Image upload */}
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
        {/* TODO: Додати прев'ю 'newImages' та існуючих 'form.images' */}
      </div>

      <Button onClick={handleSave} className="w-full">
        Save
      </Button>
    </div>
  );
}
