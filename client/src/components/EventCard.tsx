import { Link } from 'react-router-dom';
import type { Event } from '../types/event.types';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper to extract name from User | string
  const extractName = (value: string | { name: string }): string => {
    return typeof value === 'string' ? 'Loading...' : value.name;
  };

  // Get attendee count (handle both populated and non-populated)
  const attendeeCount = event.attendees.length;
  const spotsLeft = event.capacity - attendeeCount;
  const isFull = spotsLeft === 0;
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <Link to={`/events/${event._id}`} className="event-card">
      <div className="event-card-image-container">
        <img src={event.imageUrl} alt={event.title} className="event-card-image" />
        {isPastEvent && <div className="event-card-badge event-card-badge-past">Event Over</div>}
        {!isPastEvent && isFull && <div className="event-card-badge">Full</div>}
      </div>
      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-description">{event.description.substring(0, 100)}...</p>
        <div className="event-card-meta">
          <div className="event-card-meta-item">
            <span className="meta-icon">👤</span>
            <span>By {extractName(event.createdBy)}</span>
          </div>
          <div className="event-card-meta-item">
            <span className="meta-icon">📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="event-card-meta-item">
            <span className="meta-icon">📍</span>
            <span>{event.location}</span>
          </div>
          <div className="event-card-meta-item">
            <span className="meta-icon">👥</span>
            <span>
              {attendeeCount}/{event.capacity} attendees
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

