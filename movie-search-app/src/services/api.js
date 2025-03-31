import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getMovies = async () => {
  try {
    const response = await api.get('/movies');
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};