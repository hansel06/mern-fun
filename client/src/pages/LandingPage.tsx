import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CalendarPlus, Users, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import EventCard from '../components/EventCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import axios from 'axios';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

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
      <section className="relative overflow-hidden bg-surface-elevated border-b border-border py-24 sm:py-40">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-accent/20 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20">
            <Sparkles className="w-4 h-4" /> The Next Generation of Events
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight text-text-primary mb-6 leading-tight">
            Create. Connect. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">Celebrate.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-lg md:text-xl text-text-secondary mx-auto mb-10 leading-relaxed">
            The all-in-one platform to host, manage, and discover amazing events happening near you. Powered by Gemini AI for effortless event creation.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4">
                Browse Events
              </Button>
            </Link>
            <Link to={user ? "/create-event" : "/signup"}>
              <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4 flex items-center gap-2 group">
                Start Hosting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-surface">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary tracking-tight">How EventSphere Works</h2>
            <p className="mt-4 text-xl text-text-secondary">Three simple steps to your next great gathering.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10', title: '1. Create with AI', desc: 'Just enter a title and location, and let our Gemini AI write the perfect engaging description for your event.' },
              { icon: Users, color: 'text-accent', bg: 'bg-accent/10', title: '2. Invite People', desc: 'Share your public event page instantly. Attendees can securely RSVP and see capacity limits in real-time.' },
              { icon: CalendarPlus, color: 'text-success', bg: 'bg-success/10', title: '3. Manage RSVPs', desc: 'Track your attendees and hosted events from your personal dashboard. It\'s never been easier to host.' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-surface-elevated p-10 rounded-3xl border border-border text-center shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-16 h-16 ${step.bg} rounded-2xl flex items-center justify-center mx-auto mb-8 ${step.color} rotate-3 group-hover:rotate-6 transition-transform`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">{step.title}</h3>
                <p className="text-text-secondary leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Events */}
      <section className="py-24 bg-surface-elevated border-t border-border">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeUp} className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-text-primary tracking-tight">Upcoming Events</h2>
              <p className="mt-3 text-xl text-text-secondary">Don't miss out on these exciting gatherings.</p>
            </div>
            <Link to="/events" className="text-primary hover:text-primary-light font-medium flex items-center gap-2 hidden sm:flex group">
              View all <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="col-span-full text-center py-16 text-text-secondary bg-surface rounded-3xl border border-border">
                <CalendarPlus className="w-12 h-12 mx-auto text-text-secondary opacity-50 mb-4" />
                <p className="text-lg">No upcoming events right now. Be the first to host one!</p>
              </div>
            )}
          </motion.div>
          
          <div className="mt-10 text-center sm:hidden">
            <Link to="/events">
              <Button variant="secondary" className="w-full">View all events</Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
