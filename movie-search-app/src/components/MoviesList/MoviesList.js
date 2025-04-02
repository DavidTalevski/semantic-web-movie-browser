import React, { useEffect, useState, useCallback } from 'react';
import { getMovies } from '../../services/api';
import MovieCard from '../MovieCard/MovieCard';
import './MoviesList.css';

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch movies function
  const fetchMovies = useCallback(async (page = 1) => {
    try {
      const data = await getMovies(page);
      setMovies(prev => [...prev, ...data]);
      setHasMore(data.length > 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 500 >= 
        document.documentElement.offsetHeight &&
        !isLoadingMore &&
        hasMore
      ) {
        setIsLoadingMore(true);
        // Ensure we increment to integer values
        setCurrentPage(prev => parseInt(prev, 10) + 1);
        fetchMovies(parseInt(currentPage, 10) + 1);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, currentPage, fetchMovies]);

  // Filter movies based on search query
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
        <>
          <div className="movies-grid">
            {filteredMovies.map((movie, index) => (
              <MovieCard 
                key={`${movie.id}-${index}`} 
                movie={movie}
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            ))}
          </div>
          
          {isLoadingMore && (
            <div className="loading-more">
              <div className="spinner"></div>
            </div>
          )}
          
          {!hasMore && (
            <div className="end-message">
              You've reached the end of the list
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MoviesList;