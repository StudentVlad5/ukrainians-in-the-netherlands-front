import { BASE_URL } from "../CONST";

export const getAllUsers = async (token, page, search) => {
  const res = await fetch(`${BASE_URL}/users?page=${page}&search=${search}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to send request");
  }
  return res.json();
};

export const editUserData = async (token, id, formData) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to save user");
  }
  return res.json();
};

export const DeleteUserData = async (token, id) => {
  await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to remove");
  }

  return res.json();
};
