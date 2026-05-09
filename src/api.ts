export const API_URL = 'https://faragh-backend.vercel.app/api';

export const getToken = () => localStorage.getItem('token');

export const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});