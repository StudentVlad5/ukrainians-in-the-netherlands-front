import Cookies from "js-cookie";
import { BASE_URL } from "../CONST";

export async function getAllOrders(token, page, limit) {
  const accessToken = token || Cookies.get("accessToken");

  const res = await fetch(`${BASE_URL}/orders?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}
