import axios from "axios";
import { logout } from "../store/slices/authSlice";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BE_URL}/api`,
});
console.log("BE URL:", import.meta.env.VITE_APP_BE_URL);
console.log("MODE:", import.meta.env.MODE);
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("expenselog-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let interceptorsInstalled = false;

export const setupInterceptors = (dispatch) => {
  if (interceptorsInstalled) return;
  interceptorsInstalled = true;

  api.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status;

      if (status === 401) {
        const path = window.location.pathname;
        const isAuthRoute =
          path.startsWith("/login") || path.startsWith("/register");

        dispatch(logout());

        if (!isAuthRoute) {
          window.location.replace("/login");
        }
      }

      return Promise.reject(error);
    },
  );
};

export default api;
