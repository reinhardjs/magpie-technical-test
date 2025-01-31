import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data)
};

export const booksApi = {
  getAll: () => api.get('/books'),
  create: (data: any) => api.post('/books', data),
  update: (id: number, data: any) => api.put(`/books/${id}`, data),
  delete: (id: number) => api.delete(`/books/${id}`)
};

export const lendingsApi = {
  getAll: () => api.get('/lendings'),
  create: (data: any) => api.post('/lendings', data),
  return: (id: number) => api.put(`/lendings/${id}/return`),
  update: (id: number, data: any) => api.put(`/lendings/${id}`, data)
};

export const analyticsApi = {
  getPopularBooks: () => api.get('/analytics/popular-books'),
  getLendingTrends: () => api.get('/analytics/lending-trends'),
  getCategoryDistribution: () => api.get('/analytics/category-distribution')
};

export default api;
