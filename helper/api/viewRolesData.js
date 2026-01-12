import Cookies from "js-cookie";
import { BASE_URL } from "../CONST";
import { onSuccess } from "@/lib/Messages/NotifyMessages";

export const createRoleRequests = async (token, requestedRole) => {
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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to send request");
  }

  onSuccess("Successful");
  return data;
};

export const getAllRoleRequests = async (token) => {
  const res = await fetch(`${BASE_URL}/role-requests`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to send request");
  }

  return res.json();
};

export const editRoleRequests = async (token, id, status, comment) => {
  const res = await fetch(`${BASE_URL}/role-requests/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, adminComment: comment }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to send request");
  }

  return res.json();
};

export const DeleteRoleRequest = async (token, id) => {
  const res = await fetch(`${BASE_URL}/role-requests/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to send request");
  }

  return res.json();
};
