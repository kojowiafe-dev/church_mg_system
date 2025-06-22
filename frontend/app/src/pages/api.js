import axios from 'axios';

const api = axios.create({
  // baseURL: "http://localhost:8000",
  baseURL: "http://10.107.24.156:8000",
});

export default api;