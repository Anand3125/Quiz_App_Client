import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  changePassword: (data) => api.put('/api/auth/change-password', data),
};

// Quiz API
export const quizAPI = {
  getAllQuizzes: (params) => api.get('/api/quizzes', { params }),
  getQuizById: (id) => api.get(`/api/quizzes/${id}`),
  createQuiz: (data) => api.post('/api/quizzes', data),
  updateQuiz: (id, data) => api.put(`/api/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/api/quizzes/${id}`),
  togglePublish: (id) => api.put(`/api/quizzes/${id}/toggle-publish`),
  getTeacherQuizzes: (params) => api.get('/api/quizzes/teacher/my-quizzes', { params }),
  getQuizAnalytics: (id) => api.get(`/api/quizzes/${id}/analytics`),
};

// Question API
export const questionAPI = {
  getQuizQuestions: (quizId) => api.get(`/api/questions/quiz/${quizId}`),
  getQuizQuestionsWithAnswers: (quizId) => api.get(`/api/questions/quiz/${quizId}/with-answers`),
  createQuestion: (data) => api.post('/api/questions', data),
  bulkCreateQuestions: (data) => api.post('/api/questions/bulk', data),
  updateQuestion: (id, data) => api.put(`/api/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/api/questions/${id}`),
  getQuestionById: (id) => api.get(`/api/questions/${id}`),
};

// Result API
export const resultAPI = {
  submitQuizAttempt: (data) => api.post('/api/results/submit', data),
  getUserResults: (params) => api.get('/api/results/my-results', { params }),
  getResultById: (id) => api.get(`/api/results/${id}`),
  getQuizLeaderboard: (quizId, params) => api.get(`/api/results/leaderboard/quiz/${quizId}`, { params }),
  getOverallLeaderboard: (params) => api.get('/api/results/leaderboard/overall', { params }),
  getQuizResults: (quizId, params) => api.get(`/api/results/quiz/${quizId}/results`, { params }),
};

export default api;
