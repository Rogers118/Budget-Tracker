import axios from 'axios';

// Base URL points to live backend
const API_URL = process.env.REACT_APP_API_URL || 'https://budget-tracker-backend-9v7m.onrender.com/api';

// Create Axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
});

// Attach token automatically to all requests if available
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const generalApi = api;

// AI-specific endpoints
export const aiApi = {
    getOverview: (token) =>
        api.get('/ai/overview', { headers: { Authorization: `Bearer ${token}` } }),

    getForecast: (data, token) =>
        api.post('/ai/forecast', data, { headers: { Authorization: `Bearer ${token}` } }),

    getAdvice: (data, token) =>
        api.post('/ai/advice', data, { headers: { Authorization: `Bearer ${token}` } }),
};

export default api;
