import React from 'react';
import './ActorCard.css';
import { Link } from 'react-router-dom';


const ActorCard = ({ actor }) => {
  // Generate avatar initials as fallback
  const getInitials = (name) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Calculate age or lifespan
  const getLifespan = () => {
    if (!actor.birthYear) return 'Unknown age';

    const deathYear = actor.deathYear || new Date().getFullYear();
    const lifespan = deathYear - actor.birthYear;

    return actor.deathYear
      ? `${lifespan} years (${actor.birthYear} - ${actor.deathYear})`
      : `${lifespan} years old (born ${actor.birthYear})`;
  };

  // Format primary profession
  const formatProfession = (profession) => {
    if (!profession) return 'Actor';
    return profession.split(',').map(p => p.trim()).join(' • ');
  };

  return (
    <div className="actor-card">
      <div className="avatar-container">
        <div className="avatar-fallback">
          {getInitials(actor.name)}
        </div>
      </div>

      <div className="actor-content">
        <h3 className="actor-name">{actor.name}</h3>

        <div className="lifespan">
          {getLifespan()}
        </div>

        <div className="profession">
          {formatProfession(actor.primaryProfession)}
        </div>
        <div className="details-button-container">
          <Link to={`/actors/${actor.id}`} className="details-button">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActorCard;