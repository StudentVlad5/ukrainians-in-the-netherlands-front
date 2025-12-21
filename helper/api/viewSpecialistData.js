import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ===================== GET ALL ===================== */
export async function getSpecialists(token) {
  const accessToken = token || Cookies.get("accessToken");

  const res = await fetch(`${API_URL}/api/specialists`, {
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
export async function createSpecialist(token, data) {
  const res = await fetch(`${API_URL}/api/specialists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create specialist");
  }

  return res.json();
}

/* ===================== UPDATE ===================== */
export async function updateSpecialist(token, id, data) {
  const res = await fetch(`${API_URL}/api/specialists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update specialist");
  }

  return res.json();
}

/* ===================== HIDE (SOFT DELETE) ===================== */
export async function hideSpecialist(token, id) {
  const res = await fetch(`${API_URL}/api/specialists/${id}/hide`, {
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
  const res = await fetch(`${API_URL}/api/specialists/${id}`, {
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
