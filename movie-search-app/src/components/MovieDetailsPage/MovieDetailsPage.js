import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails } from '../../services/api';
import './MovieDetailsPage.css';
import {
  safeNumber,
  formatNumber,
  formatCompactNumber,
  formatRuntime,
  enhancePosterUrl,
} from '../../utils/movieUtils';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovieDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const posterUrl = enhancePosterUrl(movieDetails?.posterLink);

  return (
    <div className="movie-details">
      <Link to="/" className="movie-details__back-link">
        ← Back to Movies
      </Link>

      <div className="movie-details__main">
        <div className="movie-details__header">
          <div className="movie-details__poster-container">
            {imageError || !posterUrl ? (
              <div className="movie-details__no-poster">Poster Not Available</div>
            ) : (
              <img
                src={posterUrl}
                alt={movieDetails.title}
                className="movie-details__poster"
                onError={handleImageError}
                loading="lazy"
              />
            )}
          </div>

          <div className="movie-details__info">
            <h1 className="movie-details__title">{movieDetails.title}</h1>

            <div className="movie-details__meta-row">
              <span className="movie-details__meta-item">
                Year: {safeNumber(movieDetails.releasedYear)}
              </span>
              <span className="movie-details__meta-item">
                ⭐ {safeNumber(movieDetails.imdbRating)}
              </span>
              <span className="movie-details__meta-item">
                {formatRuntime(movieDetails.runtime)}
              </span>
              <span className="movie-details__meta-item">
                {movieDetails.certificate || 'NR'}
              </span>
            </div>
          </div>
        </div>

        {/* For Directors */}
        {movieDetails.directors?.length > 0 && (
          <div className="movie-details__crew-group">
            <h3 className="movie-details__subtitle">
              Director{movieDetails.directors.length > 1 ? 's' : ''}
            </h3>
            <div className="movie-details__people-list">
              {movieDetails.directors.map(director => (
                <Link
                  key={director.id}
                  to={`/actors/${director.id}`} 
                  className="movie-details__person-card"
                >
                  {director.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* For Cast */}
        {movieDetails.cast?.length > 0 && (
          <div className="movie-details__crew-group">
            <h3 className="movie-details__subtitle">Cast</h3>
            <div className="movie-details__people-list">
              {movieDetails.cast.map(actor => (
                <Link
                  key={actor.id}
                  to={`/actors/${actor.id}`} 
                  className="movie-details__person-card"
                >
                  <div className="movie-details__actor-name">{actor.name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="movie-details__content">
          <div className="movie-details__overview-section">
            <h3 className="movie-details__subtitle">Storyline</h3>
            <p className="movie-details__overview">
              {movieDetails.overview || 'No overview available...'}
            </p>
          </div>

          <div className="movie-details__stats-grid">
            <div className="movie-details__stat-item">
              <span className="movie-details__stat-label">Metascore</span>
              <span className="movie-details__stat-value">
                {formatNumber(movieDetails.metaScore)}
              </span>
            </div>
            <div className="movie-details__stat-item">
              <span className="movie-details__stat-label">Votes</span>
              <span className="movie-details__stat-value">
                {formatCompactNumber(movieDetails.noOfVotes)}
              </span>
            </div>
            <div className="movie-details__stat-item">
              <span className="movie-details__stat-label">Gross</span>
              <span className="movie-details__stat-value">
                ${formatCompactNumber(movieDetails.gross)}
              </span>
            </div>
            <div className="movie-details__stat-item">
              <span className="movie-details__stat-label">Budget</span>
              <span className="movie-details__stat-value">
                ${formatCompactNumber(movieDetails.budget)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
