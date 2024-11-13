import axios from 'axios';

const API_URL = 'https://spotify-8vgb.onrender.com/api/auth';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const logout = () => {
  localStorage.removeItem('token');
};
