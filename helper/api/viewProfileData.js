import Cookies from "js-cookie";

export const refreshUserProfile = async (token) => {
  const res = await fetch("/api/profile/user", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401) Cookies.remove("accessToken");
    router.push("/login");
    throw new Error("Не вдалося завантажити профіль.");
  }

  const data = await res.json();
  return data;
};

export const updateUserProfile = async (formData, token) => {
  const res = await fetch("/api/profile/user", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    throw new Error(data.message || "Помилка збереження профілю");
  }
  const data = await res.json();
  return data;
};

export const uploadUserAvatar = async (avatarFile, token) => {
  const uploadData = new FormData();
  uploadData.append("avatar", avatarFile);

  const res = await fetch("/api/profile/avatar", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: uploadData,
  });

  if (!res.ok) {
    throw new Error(data.message || "Помилка завантаження фото");
  }
  const data = await res.json();
  return data;
};
