import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Event } from '../types/event.types';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Calendar, MapPin, Users, User, ArrowLeft, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

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
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load event.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const extractId = (value: any): string => value?.id || value?._id || (typeof value === 'string' ? value : '');
  const extractName = (value: any): string => typeof value === 'string' ? 'Loading...' : value?.name || 'Unknown';

  const isCreator = event && user ? extractId(event.createdBy) === user.id : false;
  const userIsAttending = event && user ? event.attendees.some((att) => extractId(att) === user.id) : false;
  
  const attendeeCount = event?.attendees?.length || 0;
  const spotsLeft = event ? event.capacity - attendeeCount : 0;
  const isFull = spotsLeft <= 0;
  const isPastEvent = event ? new Date(event.date) < new Date() : false;

  const handleRSVP = async (): Promise<void> => {
    if (!id) return;
    setRsvpLoading(true);
    try {
      const data = await eventsAPI.rsvp(id);
      setEvent(data.event);
    } catch (err: any) {
      alert(err.response?.data?.message || 'RSVP failed.');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancelRsvp = async (): Promise<void> => {
    if (!id) return;
    setRsvpLoading(true);
    try {
      const data = await eventsAPI.cancelRsvp(id);
      setEvent(data.event);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Cancel RSVP failed.');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!id || !confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventsAPI.delete(id);
      navigate('/events');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
          <div className="w-full h-64 md:h-96 bg-gray-200 rounded-2xl"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded w-full mt-8"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-surface">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-danger mb-2">{error || 'Event not found'}</h2>
          <Link to="/events">
            <Button variant="primary" className="mt-4">Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Cover Image */}
      <div className="w-full h-64 md:h-[400px] relative">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            {event.category && (
              <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                {event.category}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Content) */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <div className="flex items-center gap-4 text-text-secondary mb-8 border-b border-border pb-6">
                <Link to="/events" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Link>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-text-primary mb-4">About this event</h2>
                <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Attendees List */}
              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> 
                  Attendees ({attendeeCount})
                </h3>
                {attendeeCount === 0 ? (
                  <p className="text-text-secondary italic">No attendees yet. Be the first!</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {event.attendees.map((attendee, index) => {
                      const name = extractName(attendee);
                      return (
                        <div key={extractId(attendee) || index} className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-border">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-text-primary">{name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Sticky Sidebar) */}
          <div className="md:col-span-1 sticky top-24 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-border">
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-secondary">Date and Time</p>
                    <p className="text-text-primary font-medium">{formatDate(event.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-secondary">Location</p>
                    <p className="text-text-primary font-medium">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-secondary">Hosted by</p>
                    <p className="text-text-primary font-medium">{extractName(event.createdBy)}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <div className="flex justify-between items-center mb-4 text-sm font-medium">
                  <span className="text-text-secondary">Availability</span>
                  <span className={isFull ? 'text-danger' : 'text-success'}>
                    {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
                  </span>
                </div>

                {/* Auth & RSVP Logic */}
                {isCreator ? (
                  <div className="space-y-3">
                    <Link to={`/events/${event._id}/edit`}>
                      <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                        <Edit2 className="w-4 h-4" /> Edit Event
                      </Button>
                    </Link>
                    <Button variant="danger" className="w-full flex items-center justify-center gap-2" onClick={handleDelete}>
                      <Trash2 className="w-4 h-4" /> Delete Event
                    </Button>
                  </div>
                ) : !user ? (
                  <Link to={`/login?returnUrl=/events/${event._id}`}>
                    <Button variant="primary" className="w-full">Login to RSVP</Button>
                  </Link>
                ) : isPastEvent ? (
                  <div className="bg-gray-100 text-gray-500 py-3 rounded-lg text-center font-medium">
                    Event has ended
                  </div>
                ) : userIsAttending ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-success font-medium mb-2">
                      <CheckCircle2 className="w-5 h-5" /> You're going!
                    </div>
                    <Button 
                      variant="danger" 
                      className="w-full" 
                      onClick={handleCancelRsvp}
                      isLoading={rsvpLoading}
                    >
                      Cancel RSVP
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    className="w-full" 
                    onClick={handleRSVP}
                    disabled={isFull}
                    isLoading={rsvpLoading}
                  >
                    {isFull ? 'Event Full' : 'RSVP Now'}
                  </Button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetail;
