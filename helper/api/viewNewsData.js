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
  const res = await fetch(`${BASE_URL}/news`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to create news");
  return res.json();
}

/* ===================== UPDATE ===================== */
export async function updateSpecialist(token, id, formData) {
  const res = await fetch(`${BASE_URL}/specialists/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to update specialist");
  return res.json();
}

/* ===================== DELETE ===================== */
export async function deleteNews(token, id) {
  const res = await fetch(`${BASE_URL}/specialists/${id}`, {
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
