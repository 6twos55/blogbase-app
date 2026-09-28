import axios from "axios";

// Fallback to local server for development, fall back to production otherwise
const dbUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: dbUrl,
});

// Axios Request Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("blogbase_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginUser = (credentials) => {
  return api.post("/auth/login", credentials);
};

export const registerUser = (userData) => {
  return api.post("/auth/register", userData);
};

export const getMe = () => {
  return api.get("/auth/me");
};

export const updateProfile = (profileData) => {
  return api.put("/auth/profile", profileData);
};

export const deleteAccount = () => {
  return api.delete("/auth/account");
};

// Media/Blog endpoints
export const getMedias = () => {
  return api.get("/medias");
};

export const getMedia = (mediaId) => {
  return api.get(`/medias/${mediaId}`);
};

export const addMedia = (formData) => {
  return api.post("/medias", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateMedia = (mediaId, formData) => {
  return api.put(`/medias/${mediaId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteMedia = (mediaId) => {
  return api.delete(`/medias/${mediaId}`);
};

export const likeMedia = (mediaId) => {
  return api.post(`/medias/${mediaId}/like`);
};

export default api;