import { useState, useEffect } from 'react';
import type { Event } from '../types/event.types';
import { eventsAPI } from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async (): Promise<void> => {
      try {
        const data = await eventsAPI.getAll();
        setEvents(data.events);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as { response?: { data?: { message?: string } } };
          setError(axiosError.response?.data?.message || 'Failed to load events.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="events-header">
        <h1>All Events</h1>
        <p className="events-subtitle">Discover and join exciting events near you</p>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <h2>No events yet</h2>
          <p>Be the first to create an event!</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;

