import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

// 1. Vamos ver o que está chegando (Abra o F12 no site publicado)
console.log("DEBUG ENV:", process.env.NEXT_PUBLIC_API_URL);

// 2. Limpeza de segurança (Remove aspas e espaços se existirem)
const envUrl = process.env.NEXT_PUBLIC_API_URL || "";
const cleanUrl = envUrl.replace(/['"]+/g, '').trim(); 

// 3. Fallback Hardcoded (Para garantir que funcione AGORA)
const baseURL = cleanUrl || "https://lista-facil-backend.zeabur.app";

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