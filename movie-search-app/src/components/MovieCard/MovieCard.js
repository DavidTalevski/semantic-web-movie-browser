import React, { useState } from 'react';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const [imageError, setImageError] = useState(false);

  // Ensure safe number conversion from Neo4j integer objects
  const safeNumber = (num) =>
    typeof num === 'object' && num !== null ? num.low || num.high || 'N/A' : num || 'N/A';

  // Format numbers with commas
  const formatNumber = (num) => {
    const number = safeNumber(num);
    return typeof number === 'number' ? number.toLocaleString() : number;
  };

  // Format large numbers (e.g., 1.8K, 2.5M)
  const formatCompactNumber = (num) => {
    const number = safeNumber(num);
    return typeof number === 'number'
      ? Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(number)
      : 'N/A';
  };

  // Enhance poster URL by modifying resolution parameters
  const enhancePosterUrl = (url) => {
    if (!url) return null;
    return url.replace(/_V1_.*\.jpg/, '_V1_UX512_.jpg'); // Ensure high-resolution fallback
  };

  // Get the best available poster
  const posterUrl = enhancePosterUrl(movie.posterLink);

  // Handle broken image
  const handleImageError = () => {
    setImageError(true);
  };

  // Format runtime into 'Xh Ym'
  const formatRuntime = (runtime) => {
    if (!runtime) return 'N/A';
    const minutes = parseInt(runtime, 10);
    return minutes > 0 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes} min`;
  };

  return (
    <div className="movie-card">
      <div className="poster-container">
        {imageError || !posterUrl ? (
          <div className="no-poster">Poster Not Available</div>
        ) : (
          <img
            src={posterUrl}
            alt={movie.title}
            className="movie-poster"
            onError={handleImageError}
            loading="lazy"
          />
        )}
        <div className="rating-badge">⭐ {safeNumber(movie.imdbRating)}</div>
      </div>

      <div className="movie-content">
        <h3 className="movie-title">{movie.title}</h3>

        <div className="metadata-row">
          <span className="year">{safeNumber(movie.releasedYear)}</span>
          <span className="certificate">{movie.certificate || 'NR'}</span>
          <span className="runtime">{formatRuntime(movie.runtime)}</span>
        </div>

        <div className="genre-tags">
          {movie.genre?.split(',').map((genre) => (
            <span key={genre.trim()} className="genre-tag">
              {genre.trim()}
            </span>
          ))}
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Metascore</span>
            <span className="stat-value">{formatNumber(movie.metaScore)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Votes</span>
            <span className="stat-value">{formatCompactNumber(movie.noOfVotes)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Gross</span>
            <span className="stat-value">${formatCompactNumber(movie.gross)}</span>
          </div>
        </div>

        <p className="movie-overview">{movie.overview || 'No overview available...'}</p>
      </div>
    </div>
  );
};

export default MovieCard;
