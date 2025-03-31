import React from 'react';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  // Convert Neo4j integer objects to numbers
  const safeNumber = (num) => {
    if (typeof num === 'object' && num !== null) {
      return num.low || num.high || 'N/A';
    }
    return num || 'N/A';
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    const number = safeNumber(num);
    return typeof number === 'number' ? number.toLocaleString() : number;
  };

  // Format numbers to compact notation (1.8K, 2.5M)
  const formatCompactNumber = (number) => {
    const num = safeNumber(number);
    if (typeof num !== 'number') return 'N/A';

    const formatter = Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 1
    });

    return formatter.format(num);
  };

  // Enhance Amazon poster URL resolution
  const enhancePosterUrl = (url) => {
    if (!url) return null;

    try {
      // Try different resolution patterns
      const resolutions = [
        url.replace(/_V1_.*\.jpg/, '_V1_.jpg'),          // Original
        url.replace(/_V1_.*\.jpg/, '_V1_UX512_.jpg'),    // 512px width
        url.replace(/_V1_.*\.jpg/, '_V1_UY218_CR0,0,218,317_AL_.jpg'), // Common HD size
        url.replace(/UX\d+_CR0,0,\d+,\d+_/, '')          // Remove crop parameters
      ];

      return resolutions.find(u => u !== url) || url;
    } catch {
      return url;
    }
  };

  // Image error handling with fallbacks
  const handleImageError = (e) => {
    const fallbacks = [
      enhancePosterUrl(movie.posterLink?.replace('_V1_', '_V1_UX512_')),
      enhancePosterUrl(movie.posterLink?.replace('_V1_', '_V1_UY218_')),
      'https://via.placeholder.com/300x450?text=Poster+Not+Available'
    ];

    let currentAttempt = 0;
    const tryNext = () => {
      if (currentAttempt < fallbacks.length) {
        e.target.src = fallbacks[currentAttempt++];
      }
    };

    e.target.onerror = tryNext;
    tryNext();
  };

  // Format runtime display
  const formatRuntime = (runtime) => {
    if (!runtime) return 'N/A';
    const minutes = parseInt(runtime) || 0;
    return minutes > 0 ?
      `${Math.floor(minutes / 60)}h ${minutes % 60}m` :
      runtime.replace(/\D/g, '') + ' min';
  };

  // Get initial poster URL
  const initialPosterUrl = enhancePosterUrl(movie.posterLink) ||
    'https://via.placeholder.com/300x450?text=Poster+Not+Available';

  return (
    <div className="movie-card">
      <div className="poster-container">
        <img
          src={initialPosterUrl}
          alt={movie.title}
          className="movie-poster"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="rating-badge">
          ⭐ {safeNumber(movie.imdbRating)}
        </div>
      </div>

      <div className="movie-content">
        <h3 className="movie-title">{movie.title}</h3>

        <div className="metadata-row">
          <span className="year">{safeNumber(movie.releasedYear)}</span>
          <span className="certificate">{movie.certificate || 'NR'}</span>
          <span className="runtime">{formatRuntime(movie.runtime)}</span>
        </div>

        <div className="genre-tags">
          {movie.genre?.split(',').map(genre => (
            <span key={genre} className="genre-tag">{genre.trim()}</span>
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

        <p className="movie-overview">
          {movie.overview || 'No overview available...'}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;