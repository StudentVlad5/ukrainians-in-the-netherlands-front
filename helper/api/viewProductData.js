import Cookies from "js-cookie";
import { BASE_URL } from "../CONST";
import { onSuccess } from "@/lib/Messages/NotifyMessages";

export const SaveDataProduct = async (token, product, formData) => {
  const res = await fetch(
    `${BASE_URL}/products${product ? `/${product._id}` : ""}`,
    {
      method: product ? "PUT" : "POST",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    if (res.status === 401) Cookies.remove("accessToken");
    router.push("/login");
    throw new Error("Не вдалося завантажити профіль.");
  }

  const data = await res.json();
  if (data) onSuccess("Збереження відбулося успішно");
  return data;
};

export const getProducts = async (
  token,
  page,
  search,
  category,
  status,
  city
) => {
  const res = await fetch(
    `${BASE_URL}/products?page=${page}&search=${search}&category=${category}&status=${status}&city=${city}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    if (res.status === 401) Cookies.remove("accessToken");
    router.push("/login");
    throw new Error("Не вдалося завантажити профіль.");
  }

  const data = await res.json();
  return data;
};

export const DeleteDataProduct = async (token, id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401) Cookies.remove("accessToken");
    router.push("/login");
    throw new Error("Не вдалося завантажити профіль.");
  }

  const data = await res.json();
  if (data) onSuccess("Видалення відбулося успішно");
  return data;
};

export async function getPublicNews(page = 1, limit = 10) {
  try {
    const res = await fetch(`${BASE_URL}/news?page=${page}&limit=${limit}`, {
      cache: "no-store", // або { next: { revalidate: 60 } } для кешування на 1 хвилину
    });

    if (!res.ok) {
      throw new Error("Failed to fetch news");
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getPublicNews:", error);
    throw error;
  }
}

export async function getPublicNewsBySlug(slug) {
  const res = await fetch(`${BASE_URL}/news/${slug}`);

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch news");
  }

  return res.json();
}
