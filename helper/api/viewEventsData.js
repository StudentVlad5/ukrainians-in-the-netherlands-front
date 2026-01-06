import { onSuccess } from "@/lib/Messages/NotifyMessages";
import { BASE_URL } from "../CONST";

export const getEvents = async (token, page = 1, limit = 10, search = "") => {
  const res = await fetch(
    `${BASE_URL}/events?page=${page}&limit=${limit}&search=${search}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.json();
};

export const deleteEvent = async (token, id) => {
  await fetch(`${BASE_URL}/events/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const SaveEvent = async (token, event, formData) => {
  const res = await fetch(`${BASE_URL}/events${event ? `/${event._id}` : ""}`, {
    method: event ? "PUT" : "POST",
    body: formData,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401) Cookies.remove("accessToken");
    router.push("/login");
    throw new Error("Не вдалося завантажити профіль.");
  }

  const data = await res.json();
  console.log("data from response:", data);
  if (data) onSuccess("Збереження відбулося успішно");
  return data;
};
