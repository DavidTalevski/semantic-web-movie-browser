import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails } from '../../services/api';
import './DetailsPage.css';
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

  if (loading) {
    return (
      <div className="page-loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Loading Actor Details...</div>
      </div>
    );
  }
  
  if (error) return <div className="error">Error: {error}</div>;

  const posterUrl = enhancePosterUrl(movieDetails?.posterLink);


  return (
    <div className="details-container">
      <Link to="/" className="details-back-link">
        ← Back to Movies
      </Link>

      <div className="details-main">
        <div className="details-header">
          <div className="details-poster-container">
            {imageError || !posterUrl ? (
              <div className="details-no-poster">Poster Not Available</div>
            ) : (
              <img
                src={posterUrl}
                alt={movieDetails.title}
                className="details-poster"
                onError={handleImageError}
                loading="lazy"
              />
            )}
          </div>

          <div className="details-info">
            <h1 className="details-title">{movieDetails.title}</h1>

            <div className="details-meta-grid">
              <MetaItem label="📅 Year" value={safeNumber(movieDetails.releasedYear)} />
              <MetaItem label="🌟 Rating" value={`${safeNumber(movieDetails.imdbRating)}`} />
              <MetaItem label="⏱️ Runtime" value={formatRuntime(movieDetails.runtime)} />
              <MetaItem label="📜 Certificate" value={movieDetails.certificate || 'NR'} />
            </div>

          </div>
        </div>

        <PeopleSection
          title="Directors"
          people={movieDetails.directors}
        />

        <PeopleSection
          title="Cast"
          people={movieDetails.cast}
        />

        <div className="content-section">
          <h3 className="section-title">Storyline</h3>
          <p className="content-description">
            {movieDetails.overview || 'No overview available...'}
          </p>
        </div>

        <div className="stats-grid">
          <StatItem label="Metascore" value={formatNumber(movieDetails.metaScore)} />
          <StatItem label="Votes" value={formatCompactNumber(movieDetails.noOfVotes)} />
          <StatItem label="Gross" value={`$${formatCompactNumber(movieDetails.gross)}`} />
          <StatItem label="Budget" value={`$${formatCompactNumber(movieDetails.budget)}`} />
        </div>
      </div>
    </div>
  );
};

const MetaItem = ({ label, value }) => (
  <div className="meta-item">
    <span className="meta-label">{label}</span>
    <span className="meta-value">{value}</span>
  </div>
);

const PeopleSection = ({ title, people }) => (
  people?.length > 0 && (
    <div className="people-section">
      <h3 className="section-title">{title}</h3>
      <div className="people-grid">
        {people.map(person => (
          <Link
            key={person.id}
            to={`/actors/${person.id}`}
            className="person-card"
          >
            {person.name}
          </Link>
        ))}
      </div>
    </div>
  )
);

const StatItem = ({ label, value }) => (
  <div className="stat-item">
    <span className="stat-label">{label}</span>
    <span className="stat-value">{value}</span>
  </div>
);

export default MovieDetailsPage;
