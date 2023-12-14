import axios from "axios";
const request = axios.create({
  withCredentials: true,
});
const jikanRequest = axios.create();

export const BASE_API = process.env.REACT_APP_BASE_API_URL;
export const USERS_API = `${BASE_API}/api/users`;
export const signin = async (credentials) => {
  const response = await request.post( `${USERS_API}/signin`, credentials );
  return response.data;
};
export const account = async () => {
    const response = await request.post(`${USERS_API}/account`);
    return response.data;
  };
  export const updateUser = async (user) => {
    const response = await request.put(`${USERS_API}/${user._id}`, user);
    return response.data;
  };

  export const findAllUsers = async () => {
    const response = await request.get(`${USERS_API}`);
    return response.data;
  };

  export const findUserReviews = async (user) => {
    const response = await request.get(`${USERS_API}/reviews/${user._id}`);
    return response.data;
  };

  export const getAnimeDetails = async (animeId) => {
    const response = await jikanRequest.get(`https://api.jikan.moe/v4/anime/${animeId}`);
    return response.data;
  };

  export const getCharacterDetails = async (characterId) => {
    const response = await jikanRequest.get(`https://api.jikan.moe/v4/characters/${characterId}`);
    return response.data;
  };
  
  export const findUserById = async (id) => {
    const response = await request.get(`${USERS_API}/${id}`);
    return response.data;
  };

  export const likeAnime = async (animeId, userId) => {
    const response = await request.post(`${USERS_API}/${userId}/liked-anime/${animeId}`);
    return response.data;
  };

  export const unlikeAnime = async (animeId, userId) => {
    const response = await request.delete(`${USERS_API}/${userId}/liked-anime/${animeId}`);
    return response.data;
  };

  export const likeCharacter = async (characterId, userId) => {
    const response = await request.post(`${USERS_API}/${userId}/liked-characters/${characterId}`);
    return response.data;
  };

  export const unlikeCharacter = async (characterId, userId) => {
    const response = await request.delete(`${USERS_API}/${userId}/liked-characters/${characterId}`);
    return response.data;
  };
  
  export const addAnime = async (anime) => {
    const response = await request.post(`${BASE_API}/api/anime`, anime);
    return response.data;
  };

  export const addCharacter = async (character) => {
    const response = await request.post(`${BASE_API}/api/characters`, character);
    return response.data;
  };

  export const getReviews = async (animeId) => {
    const response = await request.get(`${BASE_API}/api/anime-reviews/${animeId}`);
    return response.data;
  };

  export const signout = async () => {
    const response = await request.post(`${USERS_API}/signout`);
    return response.data; 
  };

  export const postReview = async (review) => {
    const response = await request.post(`${USERS_API}/reviews`, review)
    return response.data;
  };

  export const deleteReview = async (reviewId) => {
    const response = await request.delete(`${BASE_API}/api/users/reviews/${reviewId}`)
    return response.data
  }