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
/* ===================== GET ALL ===================== */
export async function getPublicProductssWithLimits(count, page = 1) {
  const res = await fetch(
    `${BASE_URL}/public/products_with_limits?limit=${count}&page=${page}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch specialists");
  }
  return res.json();
}
export async function getPublicProductsById(id) {
  const res = await fetch(`${BASE_URL}/public/products/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch specialists");
  }
  return res.json();
}
/* ===================== GET ALL ===================== */
export async function getPublicServicesWithLimits(count) {
  const res = await fetch(`${BASE_URL}/public/services?limit=${count}`);
  if (!res.ok) {
    throw new Error("Failed to fetch specialists");
  }
  return res.json();
}

export async function getPublicActiveEvents(page, limit, filter) {
  const res = await fetch(
    `${BASE_URL}/public/active-events?page=${page}&limit=${limit}&filter=${filter}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch active events");
  }
  return res.json();
}

export async function getPublicActiveEventsById(id) {
  const res = await fetch(`${BASE_URL}/public/active-events/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch active event");
  }
  return res.json();
}

export async function creatPublicOrder(orderData) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch active event");
  }
  return res.json();
}
