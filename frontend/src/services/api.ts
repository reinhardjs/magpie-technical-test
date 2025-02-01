import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error('API base URL is not defined in the environment variables');
}

export const API_BASE_URL = apiBaseUrl;

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
  register: (data: { email: string; password: string; name: string }) => api.post('/auth/register', data)
};

export const booksApi = {
  getAll: () => api.get('/books'),
  create: (data: { 
    title: string; 
    author: string; 
    isbn: string; 
    quantity: number;
    categoryId: number;
  }) => api.post('/books', data),
  update: (id: number, data: { 
    title?: string; 
    author?: string; 
    isbn?: string; 
    quantity?: number;
    categoryId?: number;
  }) => api.put(`/books/${id}`, data),
  delete: (id: number) => api.delete(`/books/${id}`)
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data: { name: string; description: string }) => api.post('/categories', data),
  update: (id: number, data: { name?: string; description?: string }) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`)
};

export const membersApi = {
  getAll: () => api.get('/members'),
  getById: (id: number) => api.get(`/members/${id}`),
  create: (data: { name: string; email: string; phone: string }) => api.post('/members', data),
  update: (id: number, data: { name?: string; email?: string; phone?: string }) => api.put(`/members/${id}`, data),
  delete: (id: number) => api.delete(`/members/${id}`)
};

export const lendingsApi = {
  getAll: () => api.get('/lendings'),
  create: (data: { bookId: number; memberId: number; dueDate: string }) => api.post('/lendings', data),
  return: (id: number) => api.put(`/lendings/${id}/return`),
  update: (id: number, data: { dueDate?: string; status?: 'active' | 'returned' }) => api.put(`/lendings/${id}`, data)
};

export const analyticsApi = {
  getPopularBooks: () => api.get('/analytics/popular-books'),
  getLendingTrends: () => api.get('/analytics/lending-trends'),
  getCategoryDistribution: () => api.get('/analytics/category-distribution')
};

export default api;
