import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CalendarPlus, Users, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import EventCard from '../components/EventCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import axios from 'axios';

const LandingPage = () => {
  const { user } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/events?limit=3');
        setFeaturedEvents(data.events || []);
      } catch (error) {
        console.error('Failed to fetch featured events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-surface-elevated border-b border-border py-20 sm:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-text-primary mb-6">
            Create. Connect. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Celebrate.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-text-secondary mx-auto mb-10">
            The all-in-one platform to host, manage, and discover amazing events happening near you. Powered by Gemini AI for effortless event creation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4">
                Browse Events
              </Button>
            </Link>
            <Link to={user ? "/create-event" : "/signup"}>
              <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4 flex items-center gap-2">
                Start Hosting <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary">How EventSphere Works</h2>
            <p className="mt-4 text-text-secondary">Three simple steps to your next great gathering.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">1. Create with AI</h3>
              <p className="text-text-secondary">Just enter a title and location, and let our Gemini AI write the perfect engaging description for your event.</p>
            </div>
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">2. Invite People</h3>
              <p className="text-text-secondary">Share your public event page instantly. Attendees can securely RSVP and see capacity limits in real-time.</p>
            </div>
            <div className="bg-surface-elevated p-8 rounded-2xl border border-border text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 text-success">
                <CalendarPlus className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">3. Manage RSVPs</h3>
              <p className="text-text-secondary">Track your attendees and hosted events from your personal dashboard. It's never been easier to host.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-surface-elevated border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">Upcoming Events</h2>
              <p className="mt-2 text-text-secondary">Don't miss out on these exciting gatherings.</p>
            </div>
            <Link to="/events" className="text-primary hover:text-primary-light font-medium flex items-center gap-1 hidden sm:flex">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : featuredEvents.length > 0 ? (
              featuredEvents.map((event: any) => (
                <EventCard key={event._id} event={event} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-text-secondary">
                No upcoming events right now. Be the first to host one!
              </div>
            )}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/events">
              <Button variant="secondary" className="w-full">View all events</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
