import axios from "axios";
import { getToken } from "../firebase/getToken";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  console.log(import.meta.env.VITE_BASE_URL);

  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
