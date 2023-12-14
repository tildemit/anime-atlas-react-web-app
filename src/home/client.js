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

  export const getAnimes = async () => {
    const response = await request.get(`${BASE_API}/api/anime`);
    return response.data;
  };

  export const getReviews = async () => {
    const response = await request.get(`${BASE_API}/api/reviews`);
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
  
  export const findUserById = async (id) => {
    const response = await request.get(`${USERS_API}/${id}`);
    return response.data;
  };

  export const follow = async (userId) => {
    const response = await request.post(`${USERS_API}/follow/${userId}`);
    return response.data;
  };

  export const unfollow = async (userId) => {
    const response = await request.delete(`${USERS_API}/unfollow/${userId}`);
    return response.data;
  };
  
  export const getAnime = async (animeId) => {
    const response = await request.get(`${BASE_API}/api/anime/${animeId}`);
    return response.data;
  };

  export const getCharacter = async (characterId) => {
    const response = await request.get(`${BASE_API}/api/characters/${characterId}`);
    return response.data;
  };

  export const signout = async () => {
    const response = await request.post(`${USERS_API}/signout`);
    return response.data; };

    export const signup = async (credentials) => {
      const response = await request.post(
        `${USERS_API}/signup`, credentials);
      return response.data;
    };
    