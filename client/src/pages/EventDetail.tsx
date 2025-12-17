import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Event } from '../types/event.types';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rsvpLoading, setRsvpLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setError('Invalid event ID');
      setLoading(false);
      return;
    }

    const fetchEvent = async (): Promise<void> => {
      try {
        const data = await eventsAPI.getOne(id);
        setEvent(data.event);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as { response?: { data?: { message?: string } } };
          setError(axiosError.response?.data?.message || 'Failed to load event.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Helper to extract ID from User | string (handles both id and _id from Mongoose)
  const extractId = (value: string | { id?: string; _id?: string }): string => {
    if (typeof value === 'string') return value;
    const obj = value as { id?: string; _id?: string };
    return obj.id || obj._id || '';
  };

  // Helper to extract name from User | string
  const extractName = (value: string | { name: string }): string => {
    return typeof value === 'string' ? 'Loading...' : value.name;
  };

  // Check if user is the creator
  const isCreator = event && user
    ? extractId(event.createdBy) === user.id
    : false;

  // Check if user is attending (handle union type)
  const userIsAttending = event && user
    ? event.attendees.some((attendee) => extractId(attendee) === user.id)
    : false;

  // Check if event is full
  const isFull = event ? event.attendees.length >= event.capacity : false;

  const handleRSVP = async (): Promise<void> => {
    if (!id) return;
    setRsvpLoading(true);
    setError(null);

    try {
      const data = await eventsAPI.rsvp(id);
      setEvent(data.event);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'RSVP failed.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancelRsvp = async (): Promise<void> => {
    if (!id) return;
    setRsvpLoading(true);
    setError(null);

    try {
      const data = await eventsAPI.cancelRsvp(id);
      setEvent(data.event);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Cancel RSVP failed.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!id || !confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventsAPI.delete(id);
      navigate('/events');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Delete failed.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !event) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/events" className="button">Back to Events</Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Event not found</h2>
          <Link to="/events" className="button">Back to Events</Link>
        </div>
      </div>
    );
  }

  const attendeeCount = event.attendees.length;
  const spotsLeft = event.capacity - attendeeCount;

  return (
    <div className="container">
      <div className="event-detail">
        <div className="event-detail-image-container">
          <img src={event.imageUrl} alt={event.title} className="event-detail-image" />
          {isFull && <div className="event-badge-full">Event Full</div>}
        </div>

        <div className="event-detail-content">
          <div className="event-detail-header">
            <h1 className="event-detail-title">{event.title}</h1>
            {isCreator && (
              <div className="event-detail-actions">
                <Link to={`/events/${event._id}/edit`} className="button button-secondary">
                  Edit
                </Link>
                <button onClick={handleDelete} className="button button-danger">
                  Delete
                </button>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="event-detail-info">
            <div className="info-item">
              <span className="info-label">👤 Created By</span>
              <span className="info-value">{extractName(event.createdBy)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">📅 Date & Time</span>
              <span className="info-value">{formatDate(event.date)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">📍 Location</span>
              <span className="info-value">{event.location}</span>
            </div>
            <div className="info-item">
              <span className="info-label">👥 Capacity</span>
              <span className="info-value">
                {attendeeCount} / {event.capacity} attendees
                {spotsLeft > 0 && <span className="spots-left">({spotsLeft} spots left)</span>}
              </span>
            </div>
          </div>

          <div className="event-detail-description">
            <h2>Description</h2>
            <p>{event.description}</p>
          </div>

          {user && !isCreator && (
            <div className="event-detail-rsvp">
              {userIsAttending ? (
                <div className="rsvp-status-container">
                  <div className="rsvp-status-badge">
                    ✅ You're attending this event!
                  </div>
                  <button
                    onClick={handleCancelRsvp}
                    disabled={rsvpLoading}
                    className="button button-danger"
                  >
                    {rsvpLoading ? 'Cancelling...' : 'Leave Event'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRSVP}
                  disabled={rsvpLoading || isFull}
                  className="button button-primary"
                >
                  {rsvpLoading ? 'Processing...' : isFull ? 'Event Full' : 'RSVP to Event'}
                </button>
              )}
            </div>
          )}

          {!user && (
            <div className="event-detail-rsvp">
              <p className="login-prompt">Please <Link to="/login">login</Link> to RSVP to this event.</p>
            </div>
          )}

          <div className="event-detail-attendees">
            <h2>Attendees ({attendeeCount})</h2>
            {attendeeCount === 0 ? (
              <p className="no-attendees">No attendees yet. Be the first to RSVP!</p>
            ) : (
              <div className="attendees-list">
                {event.attendees.map((attendee, index) => {
                  const attendeeName = typeof attendee === 'string' ? 'Loading...' : attendee.name;
                  const attendeeId = extractId(attendee);
                  return (
                    <div key={attendeeId || index} className="attendee-item">
                      <span className="attendee-avatar">{attendeeName.charAt(0).toUpperCase()}</span>
                      <span>{attendeeName}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;

