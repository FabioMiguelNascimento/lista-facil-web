import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      useAuthStore.setState({ user: null });
    }
    return Promise.reject(err);
  }
);

export default api;
