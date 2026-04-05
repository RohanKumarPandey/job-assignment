import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_SOCKET_URL
  ? `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/v1`
  : 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach Clerk session token
apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      try {
        // Clerk stores the session token in __clerk_db_jwt
        const { Clerk } = window;
        if (Clerk?.session) {
          const token = await Clerk.session.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch {
        // No session available
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ??
      error.message ??
      'Something went wrong';
    return Promise.reject({ ...error, message });
  }
);
