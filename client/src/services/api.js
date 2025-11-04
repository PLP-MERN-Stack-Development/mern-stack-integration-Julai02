// api.js - API service for making requests to the backend

import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const unwrap = (response) => {
  // Server responses are shaped { success: true, data: ... }
  if (response && response.data && response.data.data !== undefined) return response.data.data;
  return response && response.data ? response.data : response;
};

// Post API services
export const postService = {
  // Get all posts with optional pagination and filters
  getAllPosts: async (page = 1, limit = 10, category = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
  const response = await api.get(url);
  return unwrap(response);
  },

  // Get a single post by ID or slug
  getPost: async (idOrSlug) => {
  const response = await api.get(`/posts/${idOrSlug}`);
  return unwrap(response);
  },

  // Create a new post
  createPost: async (postData, extraHeaders = {}) => {
    // If postData is FormData, pass through headers (multipart handled by browser)
    const response = await api.post('/posts', postData, { headers: extraHeaders })
    return unwrap(response);
  },

  // Update an existing post
  updatePost: async (id, postData, extraHeaders = {}) => {
    const response = await api.put(`/posts/${id}`, postData, { headers: extraHeaders });
    return unwrap(response);
  },

  // Delete a post
  deletePost: async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return unwrap(response);
  },

  // Add a comment to a post
  addComment: async (postId, commentData) => {
  const response = await api.post(`/posts/${postId}/comments`, commentData);
  return unwrap(response);
  },

  // Search posts
  searchPosts: async (query) => {
    const response = await api.get(`/posts/search?q=${query}`);
    return unwrap(response);
  },
};

// Category API services
export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return unwrap(response);
  },

  // Create a new category
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return unwrap(response);
  },
};

// Auth API services
export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return unwrap(response);
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const data = unwrap(response);
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default api; 