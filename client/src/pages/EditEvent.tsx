import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Event } from '../types/event.types';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 1,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setError('Invalid event ID');
      setLoading(false);
      return;
    }

    const fetchEvent = async (): Promise<void> => {
      try {
        const data = await eventsAPI.getOne(id);
        const eventData = data.event;

        // Check if user is creator
        const extractId = (value: string | { id: string }): string => {
          return typeof value === 'string' ? value : value.id;
        };

        const creatorId = extractId(eventData.createdBy);
        if (user && creatorId !== user.id) {
          setError('You are not authorized to edit this event');
          setLoading(false);
          return;
        }

        setEvent(eventData);
        setFormData({
          title: eventData.title,
          description: eventData.description,
          date: new Date(eventData.date).toISOString().slice(0, 16),
          location: eventData.location,
          capacity: eventData.capacity,
        });
        setImagePreview(eventData.imageUrl);
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
  }, [id, user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 1 : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!id) return;

    setError(null);
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('date', new Date(formData.date).toISOString());
      formDataToSend.append('location', formData.location);
      formDataToSend.append('capacity', formData.capacity.toString());
      if (image) {
        formDataToSend.append('image', image);
      }

      await eventsAPI.update(id, formDataToSend);
      navigate(`/events/${id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to update event.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
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
          <button onClick={() => navigate('/events')} className="button">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Event not found</h2>
          <button onClick={() => navigate('/events')} className="button">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="form-title">Edit Event</h1>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date & Time *</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Capacity *</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min={1}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Event Image (leave empty to keep current)</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="form-input-file"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
              className="button button-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;

