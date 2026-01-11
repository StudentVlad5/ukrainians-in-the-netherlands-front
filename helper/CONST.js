export const navMenu = [
  { key: "home", path: "/" },
  { key: "news", path: "news" },
  { key: "events", path: "events" },
  { key: "products", path: "products" },
  { key: "masters", path: "masters" },
  { key: "profile", path: "profile" },
];

// export const BASE_URL =
//   "https://ukrainians-in-the-netherlands-backend.onrender.com/api";
export const BASE_URL = "http://localhost:3030/api";

export const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const it = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
