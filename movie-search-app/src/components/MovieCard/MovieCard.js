import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css'; import {
  safeNumber,
  formatNumber,
  formatCompactNumber,
  formatRuntime,
  enhancePosterUrl,
} from '../../utils/movieUtils';

const MovieCard = ({ movie, size = "normal" }) => {
  const [imageError, setImageError] = useState(false);



  // Get the best available poster
  const posterUrl = enhancePosterUrl(movie.posterLink);

  // Handle broken image
  const handleImageError = () => {
    setImageError(true);
  };


  return (
    <div className={`movie-card ${size === 'small' ? 'movie-card-small' : ''}`}>
      <div className="poster-container">
        {imageError || !posterUrl ? (
          <div className="no-poster">Poster Not Available</div>
        ) : (
          <Link to={`/movies/${movie.id}`}>
            <img
              src={posterUrl}
              alt={movie.title}
              className="movie-poster"
              onError={handleImageError}
              loading="lazy"
            />
          </Link>
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

        <div className="card-stats-grid">
          <div className="card-stat-item">
            <span className="stat-label">Metascore</span>
            <span className="stat-value">{formatNumber(movie.metaScore)}</span>
          </div>
          <div className="card-stat-item">
            <span className="stat-label">Votes</span>
            <span className="stat-value">{formatCompactNumber(movie.noOfVotes)}</span>
          </div>
          <div className="card-stat-item">
            <span className="stat-label">Gross</span>
            <span className="stat-value">${formatCompactNumber(movie.gross)}</span>
          </div>
        </div>

        <p className="movie-overview">{movie.overview || 'No overview available...'}</p>


        <div className="details-button-container">
          <Link to={`/movies/${movie.id}`} className="details-button">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
