import Cookies from "js-cookie";
import { BASE_URL } from "../CONST";

/* ===================== GET ALL ===================== */
export async function getNews(token) {
  const accessToken = token || Cookies.get("accessToken");

  const res = await fetch(`${BASE_URL}/news`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  return res.json();
}

/* ===================== CREATE ===================== */
export async function saveNews(token, formData) {
  // Дістаємо дані з formData, щоб зрозуміти, чи це нова новина чи стара
  const data = JSON.parse(formData.get("data"));
  const isUpdate = data._id || data.id; // Перевіряємо наявність ID

  const url = isUpdate ? `${BASE_URL}/news/${isUpdate}` : `${BASE_URL}/news`;

  const method = isUpdate ? "PUT" : "POST";

  const res = await fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      // Важливо: Content-Type для FormData ставити НЕ ТРЕБА,
      // браузер зробить це автоматично з правильним boundary
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to ${isUpdate ? "update" : "create"} news`
    );
  }

  return res.json();
}

/* ===================== DELETE ===================== */
export async function deleteNews(token, id) {
  const res = await fetch(`${BASE_URL}/news/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete specialist");
  }

  return res.json();
}
