import { BASE_URL } from "../CONST";

/* ===================== GET ALL ===================== */
export async function getPublicSpecialists() {
  const res = await fetch(`${BASE_URL}/public/specialists`);

  if (!res.ok) {
    throw new Error("Failed to fetch specialists");
  }

  return res.json();
}
