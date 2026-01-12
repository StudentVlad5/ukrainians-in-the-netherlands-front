import Cookies from "js-cookie";
import { BASE_URL } from "../CONST";

export const roleRequests = async (token, requestedRole) => {
  const accessToken = token || Cookies.get("accessToken");

  const res = await fetch(`${BASE_URL}/role-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ requestedRole }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to send request");
  }

  return res.json();
};
