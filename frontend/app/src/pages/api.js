import axios from 'axios';

const api = axios.create({
  // baseURL: "http://localhost:8000",
  baseURL: "http://10.103.1.52:8000",
});

export default api;