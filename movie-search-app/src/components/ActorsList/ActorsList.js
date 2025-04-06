import React, { useEffect, useState, useCallback } from 'react';
import { getActors } from '../../services/api';
import ActorCard from '../ActorCard/ActorCard';
import './ActorsList.css';
import useDebounce from '../../hooks/useDebounce';

const ActorsList = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 250);

  const fetchActors = useCallback(async (page = 1, search = '') => {
    try {
      const data = await getActors(page, search);
      
      setActors(prev => {
        // Reset list when new search or first page
        if (page === 1) return data;
        
        // Filter duplicates for subsequent pages
        const existingIds = new Set(prev.map(actor => actor.id));
        const newActors = data.filter(actor => !existingIds.has(actor.id));
        return [...prev, ...newActors];
      });
      
      setHasMore(data.length > 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Handle search and initial load
  useEffect(() => {
    setCurrentPage(1);
    fetchActors(1, debouncedSearch);
  }, [debouncedSearch, fetchActors]);

  // Scroll handler for pagination
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 500 < 
         document.documentElement.offsetHeight || isLoadingMore || !hasMore) return;

      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchActors(nextPage, debouncedSearch);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, isLoadingMore, hasMore, debouncedSearch, fetchActors]);

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="actors-list-container">
      <h1 className="page-title">People Directory</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search actors, directors and writers..."
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
            {actors.map((actor, index) => (
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