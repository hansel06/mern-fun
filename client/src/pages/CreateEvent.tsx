import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState<boolean>(false);
  const [generatingDescription, setGeneratingDescription] = useState<boolean>(false);

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

  const handleGenerateDescription = async (): Promise<void> => {
    if (!formData.title.trim() || !formData.location.trim()) {
      setError('Please enter event title and location to generate description');
      return;
    }

    setGeneratingDescription(true);
    setError(null);

    try {
      const response = await eventsAPI.generateDescription({
        title: formData.title,
        location: formData.location,
        date: formData.date || undefined,
        capacity: formData.capacity || undefined,
      });

      if (response.success && response.description) {
        setFormData((prev) => ({
          ...prev,
          description: response.description,
        }));
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to generate description. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to generate description. Please try again.');
      }
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!image) {
      setError('Please select an image');
      setLoading(false);
      return;
    }

    try {
      // Validate date
      if (!formData.date) {
        setError('Please select a date and time');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      
      // Convert datetime-local to ISO string
      const dateValue = new Date(formData.date);
      if (isNaN(dateValue.getTime())) {
        setError('Invalid date format');
        setLoading(false);
        return;
      }
      formDataToSend.append('date', dateValue.toISOString());
      
      formDataToSend.append('location', formData.location.trim());
      formDataToSend.append('capacity', formData.capacity.toString());
      formDataToSend.append('image', image);

      const response = await eventsAPI.create(formDataToSend);
      navigate(`/events/${response.event._id}`);
    } catch (err: unknown) {
      console.error('Create event error:', err);
      
      // Extract error message from axios error
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        
        // Log the full response for debugging
        console.error('Full error response:', axiosError.response?.data);
        console.error('Error status:', axiosError.response?.status);
        
        const errorData = axiosError.response?.data;
        let errorMessage = errorData?.message || errorData?.error || 'Failed to create event';
        
        // Add received fields info if available
        if (errorData?.received) {
          errorMessage += `. Received: ${JSON.stringify(errorData.received)}`;
        }
        
        setError(errorMessage);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="form-title">Create New Event</h1>
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
              placeholder="Enter event title"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="description">Description *</label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={generatingDescription || !formData.title.trim() || !formData.location.trim()}
                className="button button-ai"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                {generatingDescription ? '🔄 Generating...' : '✨ AI Generate'}
              </button>
            </div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="form-textarea"
              placeholder="Describe your event or click 'AI Generate' to create one automatically"
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
              placeholder="Enter event location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Event Image *</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="form-input-file"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/events')}
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

export default CreateEvent;

