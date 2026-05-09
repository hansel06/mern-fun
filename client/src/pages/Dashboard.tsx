import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI, eventsAPI } from '../services/api';
import type { Event } from '../types/event.types';
import EventCard from '../components/EventCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import Button from '../components/ui/Button';
import { Calendar, PlusCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'hosting' | 'attending'>('hosting');
  const [hostedEvents, setHostedEvents] = useState<Event[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [hostedRes, attendedRes] = await Promise.all([
          usersAPI.getMyEvents(),
          usersAPI.getMyRsvps()
        ]);
        setHostedEvents(hostedRes.events || []);
        setAttendedEvents(attendedRes.events || []);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCancelRsvp = async (eventId: string) => {
    try {
      await eventsAPI.cancelRsvp(eventId);
      setAttendedEvents(prev => prev.filter(e => e._id !== eventId));
      toast.success('RSVP cancelled successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel RSVP');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      await eventsAPI.delete(eventId);
      setHostedEvents(prev => prev.filter(e => e._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="min-h-screen bg-surface py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Welcome back, {user?.name.split(' ')[0]}</h1>
              <p className="text-text-secondary mt-1">Manage your events and RSVPs</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            <div className="flex gap-4">
              <div className="text-center px-4 sm:px-6 border-r border-border">
                <div className="text-3xl font-bold text-primary">{hostedEvents.length}</div>
                <div className="text-sm font-medium text-text-secondary">Hosted</div>
              </div>
              <div className="text-center px-4 sm:px-6">
                <div className="text-3xl font-bold text-primary">{attendedEvents.length}</div>
                <div className="text-sm font-medium text-text-secondary">Attending</div>
              </div>
            </div>
            
            <Link to="/create-event" className="w-full sm:w-auto mt-4 sm:mt-0">
              <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                <PlusCircle className="w-5 h-5" /> Host Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border mb-8">
          <div className="flex gap-8">
            <button
              className={`pb-4 text-lg font-medium transition-colors relative ${
                activeTab === 'hosting' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveTab('hosting')}
            >
              Hosting
              {activeTab === 'hosting' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-md" />
              )}
            </button>
            <button
              className={`pb-4 text-lg font-medium transition-colors relative ${
                activeTab === 'attending' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setActiveTab('attending')}
            >
              Attending
              {activeTab === 'attending' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-md" />
              )}
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div>
            {activeTab === 'hosting' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-text-primary">Events You're Hosting</h2>
                </div>
                
                {hostedEvents.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-border p-12 text-center">
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">No hosted events</h3>
                    <p className="text-text-secondary mb-6">You haven't created any events yet.</p>
                    <Link to="/create-event">
                      <Button variant="primary">Host an Event</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hostedEvents.map(event => (
                      <div key={event._id} className="relative group">
                        <EventCard event={event} />
                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/events/${event._id}/edit`}>
                            <button className="bg-white/90 backdrop-blur text-sm font-medium px-3 py-1 rounded-md shadow-sm border border-border hover:bg-gray-50 transition">
                              Edit
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDeleteEvent(event._id)}
                            className="bg-danger/90 backdrop-blur text-white text-sm font-medium px-3 py-1 rounded-md shadow-sm hover:bg-danger transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'attending' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-text-primary">Events You're Attending</h2>
                </div>
                
                {attendedEvents.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-border p-12 text-center">
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">Not attending anything yet</h3>
                    <p className="text-text-secondary mb-6">Find something interesting to do this weekend!</p>
                    <Link to="/events">
                      <Button variant="secondary">Browse Events</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {attendedEvents.map(event => (
                      <div key={event._id} className="relative group">
                        <EventCard event={event} />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleCancelRsvp(event._id)}
                            className="bg-danger/90 backdrop-blur text-white text-sm font-medium px-3 py-1 rounded-md shadow-sm hover:bg-danger transition"
                          >
                            Cancel RSVP
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
