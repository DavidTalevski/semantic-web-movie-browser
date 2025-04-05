import React, { useEffect, useState, useCallback } from 'react';
import { getMovies } from '../../services/api';
import MovieCard from '../MovieCard/MovieCard';
import './MoviesList.css';

// Add debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState('year');


  // Add debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchMovies = useCallback(async (page = 1, search = '', fetchBy = 'year') => {
    try {
      const data = await getMovies(page, search, fetchBy);
      setMovies(prev => {
        // Reset movies if new search or first page
        if (page === 1) return data;

        // Filter duplicates for subsequent pages
        const existingIds = new Set(prev.map(movie => movie.id));
        const newMovies = data.filter(movie => !existingIds.has(movie.id));
        return [...prev, ...newMovies];
      });
      setHasMore(data.length > 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Handle search changes
  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(1, debouncedSearchQuery, sortBy);
  }, [debouncedSearchQuery, sortBy, fetchMovies]);
  // Handle scroll for pagination
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 500 <
        document.documentElement.offsetHeight || isLoadingMore || !hasMore) return;

      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMovies(nextPage, debouncedSearchQuery);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, isLoadingMore, hasMore, debouncedSearchQuery, fetchMovies]);

  return (
    <div className="movies-list-container">
      <h1 className="page-title">Movie Browser</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="year">Release Year</option>
          <option value="rating">IMDB Rating</option>
          <option value="votes">Number of Votes</option>
          <option value="gross">Box Office Gross</option>
        </select>
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
            {movies.map((movie, index) => (
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