import React, { useEffect, useState, useCallback } from 'react';
import { getActors } from '../../services/api';
import ActorCard from '../ActorCard/ActorCard';
import './ActorsList.css';

const ActorsList = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchActors = useCallback(async (page = 1) => {
    try {
      const data = await getActors(page);
      setActors(prev => [...prev, ...data]);
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
    fetchActors();
  }, [fetchActors]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 500 >= 
        document.documentElement.offsetHeight &&
        !isLoadingMore &&
        hasMore
      ) {
        setIsLoadingMore(true);
        setCurrentPage(prev => prev + 1);
        fetchActors(currentPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, currentPage, fetchActors]);

  const filteredActors = actors.filter(actor =>
    actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    actor.primaryProfession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(actor.birthYear).includes(searchQuery) ||
    String(actor.deathYear).includes(searchQuery)
  );

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="actors-list-container">
      <h1 className="page-title">Actors Directory</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search actors..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="actors-grid">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="actor-card skeleton" style={{
              height: '400px',
              animationDelay: `${index * 0.1}s`
            }} />
          ))}
        </div>
      ) : (
        <>
          <div className="actors-grid">
            {filteredActors.map((actor, index) => (
              <ActorCard 
                key={`${actor.id}-${index}`}
                actor={actor}
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
              No more actors to load
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActorsList;