import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Neo4j Info
export const getNeo4jInfo = async () => {
  try {
    const response = await api.get('/neo4j-info');
    return response.data;
  } catch (error) {
    console.error('Error fetching Neo4j info:', error);
    throw error;
  }
};

// Movies
export const getMovies = async (page = 1, search = '', sort = 'year') => {
  try {
    const response = await api.get('/movies', {
      params: {
        page: page | 0,
        limit: 24,
        search,
        sort
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
// Actors
export const getActors = async (page = 1, search = '') => {
  try {
    const response = await api.get('/actors', {
      params: {
        page: parseInt(page, 10),
        limit: 24,
        search
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching actors:', error);
    throw error;
  }
};

// Single Actor
export const getActorById = async (id) => {
  try {
    const response = await api.get(`/actors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching actor:', error);
    throw error;
  }
};

// Actor's Movies
export const getActorMovies = async (id) => {
  try {
    const response = await api.get(`/actors/${id}/movies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching actor movies:', error);
    throw error;
  }
};

// Directors
export const getDirectors = async () => {
  try {
    const response = await api.get('/directors');
    return response.data;
  } catch (error) {
    console.error('Error fetching directors:', error);
    throw error;
  }
};

// Director's Movies
export const getDirectorMovies = async (id) => {
  try {
    const response = await api.get(`/directors/${id}/movies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching director movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (id) => {
  try {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getActorDetails = async (id) => {
  try {
    const response = await api.get(`/actors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching actor details:', error);
    throw error;
  }
};