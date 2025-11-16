import Cookies from "js-cookie";
import { BASE_URL } from "../CONST";

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
