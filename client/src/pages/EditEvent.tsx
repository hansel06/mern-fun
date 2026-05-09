import { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Event } from '../types/event.types';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Sparkles, UploadCloud, ArrowLeft, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CATEGORIES = ['Music', 'Tech', 'Sports', 'Networking', 'Art', 'Food', 'Other'];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Other',
    description: '',
    date: '',
    location: '',
    capacity: 1,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);

  useEffect(() => {
    if (!id) {
      toast.error('Invalid event ID');
      navigate('/events');
      return;
    }

    const fetchEvent = async () => {
      try {
        const data = await eventsAPI.getOne(id);
        const eventData = data.event;

        const creatorId = typeof eventData.createdBy === 'string' ? eventData.createdBy : (eventData.createdBy as any)._id || (eventData.createdBy as any).id;
        
        if (user && creatorId !== user.id) {
          toast.error('You are not authorized to edit this event');
          navigate(`/events/${id}`);
          return;
        }

        setEvent(eventData);
        setFormData({
          title: eventData.title,
          category: eventData.category || 'Other',
          description: eventData.description,
          date: new Date(eventData.date).toISOString().slice(0, 16),
          location: eventData.location,
          capacity: eventData.capacity,
        });
        setImagePreview(eventData.imageUrl);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to load event.');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 1 : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title.trim() || !formData.location.trim()) {
      toast.error('Please enter an event title and location first');
      return;
    }

    setGeneratingDescription(true);
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
        toast.success('Description generated!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'AI generation failed. Please try manually.');
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      await eventsAPI.delete(id);
      toast.success('Event deleted successfully');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.date) {
      toast.error('Please select a date and time');
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description.trim());
      
      const dateValue = new Date(formData.date);
      formDataToSend.append('date', dateValue.toISOString());
      
      formDataToSend.append('location', formData.location.trim());
      formDataToSend.append('capacity', formData.capacity.toString());
      if (image) {
        formDataToSend.append('image', image);
      }

      await eventsAPI.update(id, formDataToSend);
      toast.success('Event updated successfully!');
      navigate(`/events/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-10 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-text-secondary font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-surface py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 flex justify-between items-center">
          <Link to={`/events/${id}`} className="inline-flex items-center gap-1 text-text-secondary hover:text-primary transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Event
          </Link>
          <Button variant="danger" className="flex items-center gap-2 py-1.5 px-3 text-sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" /> Delete Event
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 md:p-10 border-b border-border bg-gray-50">
            <h1 className="text-3xl font-extrabold text-text-primary">Edit Event</h1>
            <p className="text-text-secondary mt-2">Update the details of your event below.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
            
            {/* Basic Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-text-primary border-b border-border pb-2">Basic Information</h2>
              
              <Input
                id="title"
                name="title"
                type="text"
                label="Event Title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="category" className="block text-sm font-medium text-text-primary">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-border rounded-lg bg-white text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                    required
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <Input
                  id="location"
                  name="location"
                  type="text"
                  label="Location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="date"
                  name="date"
                  type="datetime-local"
                  label="Date & Time"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  label="Capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min={1}
                />
              </div>
            </div>

            {/* Description & AI */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h2 className="text-xl font-bold text-text-primary">Event Description</h2>
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex items-center gap-2 py-1.5 px-3 text-sm"
                  onClick={handleGenerateDescription}
                  isLoading={generatingDescription}
                  disabled={!formData.title.trim() || !formData.location.trim()}
                >
                  <Sparkles className="w-4 h-4 text-accent" /> AI Rewrite
                </Button>
              </div>

              <div className="space-y-1">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="block w-full px-4 py-3 border border-border rounded-lg bg-white text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow resize-y"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-6 pt-4">
              <h2 className="text-xl font-bold text-text-primary border-b border-border pb-2">Cover Image</h2>
              <p className="text-sm text-text-secondary -mt-4">Leave this alone to keep your current image.</p>
              
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer border-border hover:border-primary/50 hover:bg-gray-50`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <img src={imagePreview} alt="Preview" className="h-48 object-cover rounded-lg shadow-sm mb-4" />
                    <p className="text-sm font-medium text-primary flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Click to upload a different image
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium text-text-primary mb-1">Click to upload a new image</p>
                    <p className="text-sm text-text-secondary">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <Link to={`/events/${id}`} className="flex-1">
                <Button type="button" variant="secondary" className="w-full py-3">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" className="flex-[2] py-3 text-lg" isLoading={submitting}>
                Save Changes
              </Button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default EditEvent;
