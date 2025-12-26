import { BASE_URL } from "../CONST";

/* ===================== GET ALL ===================== */
export async function getPublicSpecialists() {
  const res = await fetch(`${BASE_URL}/public/specialists`);
  if (!res.ok) {
    throw new Error("Failed to fetch specialists");
  }
  return res.json();
}
/* ===================== GET ALL ===================== */
export async function getPublicSpecialistsWithLimits(count) {
  const res = await fetch(`${BASE_URL}/public/specialists?limit=${count}`);
  if (!res.ok) {
    throw new Error("Failed to fetch specialists");
  }
  return res.json();
}

/* ===================== GET BY ID ===================== */
export async function getPublicSpecialistById(id) {
  const res = await fetch(`${BASE_URL}/public/specialists/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch specialists");
  }
  return res.json();
}
