import { BASE_URL } from "../CONST";

export const getEvents = async (token, page = 1, limit = 10, search = "") => {
  const res = await fetch(
    `${BASE_URL}/api/events?page=${page}&limit=${limit}&search=${search}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.json();
};

export const deleteEvent = async (token, id) => {
  await fetch(`${BASE_URL}/api/events/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};
