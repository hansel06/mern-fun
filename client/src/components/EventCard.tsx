import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, User } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  imageUrl: string;
  category?: string;
  createdBy: any;
  attendees: string[];
}

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

const EventCard = ({ event, compact = false }: EventCardProps) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const extractName = (value: string | { name: string }): string => {
    return typeof value === 'string' ? 'Loading...' : value?.name || 'Unknown';
  };

  const attendeeCount = event.attendees?.length || 0;
  const spotsLeft = event.capacity - attendeeCount;
  const isFull = spotsLeft <= 0;
  const isPastEvent = new Date(event.date) < new Date();
  const progressPercentage = Math.min((attendeeCount / event.capacity) * 100, 100);

  return (
    <Link 
      to={`/events/${event._id}`} 
      className={`group block bg-surface-elevated rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative ${compact ? 'max-w-sm' : ''}`}
    >
      {/* Top Banner Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-10" />

      {/* Image Section */}
      <div className={`relative w-full ${compact ? 'aspect-[2/1]' : 'aspect-video'} bg-gray-100 overflow-hidden`}>
        <img 
          src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4'} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Category Badge */}
        {event.category && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
            {event.category}
          </div>
        )}

        {/* Status Badges */}
        {isPastEvent ? (
          <div className="absolute top-3 right-3 bg-gray-600/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            Event Over
          </div>
        ) : isFull ? (
          <div className="absolute top-3 right-3 bg-danger/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            Full
          </div>
        ) : null}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col h-full">
        <h3 className="text-lg font-bold text-text-primary line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        
        {!compact && (
          <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-grow">
            {event.description}
          </p>
        )}

        {/* Meta Info */}
        <div className={`flex flex-col gap-2 ${compact ? 'mb-3' : 'mt-auto mb-4'}`}>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="truncate">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="truncate">{event.location}</span>
          </div>
          {!compact && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <User className="w-4 h-4 text-primary" />
              <span className="truncate">Hosted by {extractName(event.createdBy)}</span>
            </div>
          )}
        </div>

        {/* Capacity Bar */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex justify-between items-center mb-1 text-xs font-medium">
            <span className="text-text-secondary flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {attendeeCount} attending
            </span>
            <span className={isFull ? 'text-danger' : 'text-text-secondary'}>
              {event.capacity} spots
            </span>
          </div>
          <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full ${isFull ? 'bg-danger' : 'bg-accent'} transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
