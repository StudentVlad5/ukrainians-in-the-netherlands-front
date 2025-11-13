import Cookies from "js-cookie";

export const checkToken = (router) => {
  const token = Cookies.get("accessToken");

  if (!token) {
    router.push("/login");
    return;
  }
  return token;
};

export const checkTokenWithStay = () => {
  const token = Cookies.get("accessToken");

  if (!token) {
    setError("Сесія застаріла. Будь ласка, оновіть сторінку.");
    setIsUploading(false);
    return;
  }
  return token;
};
