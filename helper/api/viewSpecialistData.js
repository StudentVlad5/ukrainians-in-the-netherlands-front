import Cookies from "js-cookie";
import { BASE_URL } from "../CONST";

/* ===================== GET ALL ===================== */
export async function getSpecialists(token) {
  const accessToken = token || Cookies.get("accessToken");

  const res = await fetch(`${BASE_URL}/specialists`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch specialists");
  }

  return res.json();
}

/* ===================== CREATE ===================== */
export async function createSpecialist(token, formData) {
  const res = await fetch(`${BASE_URL}/specialists`, {
    method: "POST",
    headers: {
      // ПРИМІТКА: Content-Type НЕ ставимо вручну для FormData!
      Authorization: `Bearer ${token}`,
    },
    body: formData, // Передаємо FormData напряму
  });

  if (!res.ok) throw new Error("Failed to create specialist");
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

/* ===================== HIDE (SOFT DELETE) ===================== */
export async function hideSpecialist(token, id) {
  const res = await fetch(`${BASE_URL}/specialists/${id}/hide`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to hide specialist");
  }

  return res.json();
}

/* ===================== DELETE ===================== */
export async function deleteSpecialist(token, id) {
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
