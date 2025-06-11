import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8000",
  // baseURL: "http://10.107.25.97:8000",
  // baseURL: "http://10.11.24.104:8000",
});

export default api;