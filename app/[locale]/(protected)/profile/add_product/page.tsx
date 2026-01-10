"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/UI/Card/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/Dialog/dialog";

import { Input } from "@/components/UI/Input/Input";
import { Button } from "@/components/UI/Button/Button";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { checkToken } from "@/helper/api/checkTocken";
import { useRouter } from "next/navigation";
import { refreshUserProfile } from "@/helper/api/viewProfileData";
import Cookies from "js-cookie";
import { ProductForm } from "@/components/Administration/ProductForm/ProductForm";
import { IProduct } from "@/components/Administration/types";
import { DeleteDataProduct, getProducts } from "@/helper/api/viewProductData";

// --- Main Page -------------------------------------------------------
export default function ProductsDashboardPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState("");
  const router = useRouter();
  const t = useTranslations("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = checkToken(router);

      try {
        const data = await refreshUserProfile(token);
        if (data.role !== "seller" && data.role !== "admin") {
          router.push("/profile");
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const fetchProducts = useCallback(async () => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const data = await getProducts(
          token,
          page,
          search,
          category,
          status,
          city
        );

        if (data.items) setProducts(data.items);
        if (data.pages) setTotalPages(data.pages);
        if (data.total) setTotalItems(data.total);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    }
  }, [page, search, category, status, city]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function deleteItem(p: IProduct) {
    const token = checkToken(router);
    try {
      if (p._id) {
        const res = await DeleteDataProduct(token, p._id);
        if (res.success && res.success === true) {
          fetchProducts();
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  function openEdit(p: IProduct) {
    setEditingProduct(p);
    setModalOpen(true);
  }

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleFormSave = () => {
    setModalOpen(false);
    fetchProducts();
  };

  if (isLoading) {
    return <section className="p-10 text-center">{t("loading")}</section>;
  }

  return (
    <div className="p-10 w-full">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Products: {totalItems > 0 && totalItems}
            </h1>
          </div>
          <Button onClick={openCreate}>Add Product</Button>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="flex flex-col">
              <label
                htmlFor="status-select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status-select"
                className="border p-2 rounded w-full h-[42px]"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "active" | "archived" | "blocked")
                }
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="archived">Archive</option>
                <option value="blocked">Blocke</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="hidden md:table w-full border">
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
                {products?.map((p) => (
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
                    <td className="p-2 flex flex-col gap-2">
                      <Button onClick={() => openEdit(p)}>Edit</Button>
                      <Button
                        onClick={() => deleteItem(p)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* MOBILE CARD VIEW */}
            <div className="md:hidden space-y-4">
              {products?.map((p) => (
                <div
                  key={p._id}
                  className="border rounded-lg p-3 shadow-sm bg-white"
                >
                  <div className="flex gap-3">
                    {p.images?.[0] && (
                      <Image
                        src={p.images[0]}
                        width={80}
                        height={80}
                        alt={p.title.uk}
                        className="rounded object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{p.title.uk}</h3>
                      <p className="text-sm text-gray-600">{p.category}</p>
                      <p className="text-sm text-gray-600">{p.location.city}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="font-medium text-gray-900">€{p.price}</p>
                    <p className="text-sm text-gray-700">Status: {p.status}</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => openEdit(p)} className="flex-1">
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteItem(p)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              className="flex justify-center items-center"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>
            <span className="py-2">
              Page {page} / {totalPages}
            </span>
            <Button
              className="flex justify-center items-center"
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
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Create Product"}
            </DialogTitle>
          </DialogHeader>
          {/* Multilingual Form */}
          <ProductForm
            key={editingProduct?._id || "new"}
            product={editingProduct}
            onClose={handleFormSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
