import axios from "axios";

const dbUrl = 'http://localhost:3000/api';

export const getMedias = () => {
  return axios.get(`${dbUrl}/medias`);
}

export const getLogo = (blogbase) => {
  return axios.get(`${dbUrl}/logos`);
}

export const getMedia = (mediaId) => {
  return axios.get(`${dbUrl}/medias/${mediaId}`);
}

export const addMedia = (media) => {
  return axios.post(`${dbUrl}/medias`, media);
}

export const updateMedia = (mediaId, media) => {
  return axios.put(`${dbUrl}/medias/${mediaId}`, media);
}

export const deleteMedia = (mediaId) => {
  return axios.delete(`${dbUrl}/medias/${mediaId}`);
} 