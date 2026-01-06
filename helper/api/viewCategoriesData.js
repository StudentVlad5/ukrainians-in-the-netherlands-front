import Cookies from "js-cookie";
import { BASE_URL } from "../CONST";

/* ===================== GET ALL ===================== */
export async function getCategories(token) {
  const accessToken = token || Cookies.get("accessToken");

  const res = await fetch(`${BASE_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

/* ===================== CREATE ===================== */
export async function saveCategory(token, data) {
  const dataForm = JSON.stringify(data);
  const isUpdate = data._id || data.id;

  const url = isUpdate
    ? `${BASE_URL}/categories/${isUpdate}`
    : `${BASE_URL}/categories`;

  const method = isUpdate ? "PUT" : "POST";

  const res = await fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: dataForm,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Failed to ${isUpdate ? "update" : "create"} categories`
    );
  }

  return res.json();
}

/* ===================== DELETE ===================== */
export async function deleteCategory(token, id) {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete category");
  }

  return res.json();
}
