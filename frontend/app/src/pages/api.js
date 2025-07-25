import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  // baseURL: "http://10.107.24.156:8000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
