// MoviesList.js
import React, { useEffect, useState } from 'react';
import { getMovies } from '../../services/api';
import MovieCard from '../MovieCard/MovieCard';
import './MoviesList.css';

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.overview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="movies-list-container">
      <h1 className="page-title">Movie Explorer</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="movies-grid">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="movie-card skeleton" style={{
              height: '500px',
              animationDelay: `${index * 0.1}s`
            }} />
          ))}
        </div>
      ) : (
        <div className="movies-grid">
          {filteredMovies.map((movie, index) => (
            <MovieCard 
              key={movie.id} 
              movie={movie}
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesList;