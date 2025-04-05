import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getActorDetails } from '../../services/api';
import './ActorDetailsPage.css';

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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;


  return (
    <div className="actor-details">
      <Link to="/actors" className="actor-details__back-link">
        ← Back to Actors
      </Link>

      <div className="actor-details__main">
        <div className="actor-details__header">
          <div className="actor-details__avatar">
            <div className="avatar-fallback-large">
              {actorDetails.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          
          <div className="actor-details__info">
            <h1 className="actor-details__name">{actorDetails.name}</h1>
            <div className="actor-details__lifespan">
              {actorDetails.birthYear && 
                `${actorDetails.birthYear} - ${actorDetails.deathYear || 'Present'}`}
            </div>
            <div className="actor-details__profession">
              {actorDetails.primaryProfession?.split(',').join(' • ')}
            </div>
          </div>
        </div>

        {actorDetails.actedMovies?.length > 0 && (
          <div className="actor-details__movies-section">
            <h2 className="actor-details__section-title">Acted In</h2>
            <div className="actor-details__movies-grid">
              {actorDetails.actedMovies.map(movie => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="actor-details__movie-card"
                >
                  <div className="actor-details__movie-title">{movie.title}</div>
                  <div className="actor-details__movie-year">{movie.releasedYear}</div>
                  <div className="actor-details__movie-rating">⭐ {movie.imdbRating}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {actorDetails.directedMovies?.length > 0 && (
          <div className="actor-details__movies-section">
            <h2 className="actor-details__section-title">Directed</h2>
            <div className="actor-details__movies-grid">
              {actorDetails.directedMovies.map(movie => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="actor-details__movie-card"
                >
                  <div className="actor-details__movie-title">{movie.title}</div>
                  <div className="actor-details__movie-year">{movie.releasedYear}</div>
                  <div className="actor-details__movie-rating">⭐ {movie.imdbRating}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActorDetailsPage;