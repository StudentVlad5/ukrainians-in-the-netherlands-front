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
