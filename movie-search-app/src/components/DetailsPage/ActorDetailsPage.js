import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getActorDetails } from '../../services/api';
import MovieCard from '../MovieCard/MovieCard'; // Import MovieCard
import './DetailsPage.css';

const ActorDetailsPage = () => {
  const { id } = useParams();
  const [actorDetails, setActorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getActorDetails(id);
        setActorDetails(data);
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

  return (
    <div className="details-container">
      <Link to="/actors" className="details-back-link">
        ← Back to Actors
      </Link>

      <div className="details-main">
        <div className="details-header">
          <div className="details-avatar">
            <div className="avatar-fallback-large">
              {actorDetails.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          
          <div className="details-info">
            <h1 className="details-title">{actorDetails.name}</h1>
            <div className="details-meta">
              {actorDetails.birthYear && 
                `${actorDetails.birthYear} - ${actorDetails.deathYear || 'Present'}`}
            </div>
            <div className="details-submeta">
              {actorDetails.primaryProfession?.split(',').join(' • ')}
            </div>
          </div>
        </div>

        {actorDetails.actedMovies?.length > 0 && (
          <div className="movies-section">
            <h2 className="section-title">Acted In</h2>
            <div className="actor-movies-grid">
              {actorDetails.actedMovies.map(movie => (
                <MovieCard key={`acted-${movie.id}`} movie={movie} size="small" />
              ))}
            </div>
          </div>
        )}

        {actorDetails.directedMovies?.length > 0 && (
          <div className="movies-section">
            <h2 className="section-title">Directed</h2>
            <div className="actor-movies-grid">
              {actorDetails.directedMovies.map(movie => (
                <MovieCard key={`directed-${movie.id}`} movie={movie} size="small" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActorDetailsPage;