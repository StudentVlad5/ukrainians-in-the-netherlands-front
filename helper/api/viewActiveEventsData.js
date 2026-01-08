import axios from "axios";
import { BASE_URL } from "../CONST";

/**
 * Отримання списку активованих івентів з пагінацією та фільтрами
 */
export const getActiveEvents = async (token, params) => {
  const response = await axios.get(`${BASE_URL}/active-events`, {
    headers: { Authorization: `Bearer ${token}` },
    params, // axios автоматично перетворить об'єкт у query string: ?page=1&limit=10...
  });
  return response.data;
};

/**
 * Створення або оновлення сеансу в календарі
 */
export const saveActiveEvent = async (token, id, data) => {
  if (id) {
    // Редагування існуючого сеансу
    const response = await axios.put(`${BASE_URL}/active-events/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } else {
    // Створення нового запису
    const response = await axios.post(`${BASE_URL}/active-events`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
};

/**
 * Видалення сеансу (або зміна статусу на заблокований)
 */
export const deleteActiveEvent = async (token, id) => {
  const response = await axios.delete(`${BASE_URL}/active-events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getActiveEventById = async (token, id) => {
  const response = await axios.get(`${BASE_URL}/active-events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
