import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:13002',
});

export default api;