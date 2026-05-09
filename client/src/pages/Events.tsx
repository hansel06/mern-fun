import { useState, useEffect, useCallback } from 'react';
import type { Event } from '../types/event.types';
import { eventsAPI } from '../services/api';
import EventCard from '../components/EventCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = ['All', 'Music', 'Tech', 'Sports', 'Networking', 'Art', 'Food', 'Other'];

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1); // Reset to page 1 on category change
  };

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getAll({
        search: debouncedSearch || undefined,
        category: category !== 'All' ? category : undefined,
        page,
        limit: 6 // 6 items per page for a nice 3-column grid layout
      });
      setEvents(data.events);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-danger mb-2">Oops! Something went wrong</h2>
          <p className="text-text-secondary">{error}</p>
          <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">Discover Events</h1>
          <p className="text-text-secondary">Find and join the best local events happening near you.</p>
        </div>

        {/* Filters section */}
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:flex-1">
            <label className="block text-sm font-medium text-text-primary mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-white text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none"
                placeholder="Search by title or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-text-primary mb-1">Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SlidersHorizontal className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-white text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none appearance-none"
                value={category}
                onChange={handleCategoryChange}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results section */}
        <div className="mb-4 text-sm font-medium text-text-secondary">
          {loading ? 'Searching...' : `Found ${totalCount} events`}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No events found</h3>
            <p className="text-text-secondary">
              We couldn't find any events matching your current filters. Try adjusting your search or category.
            </p>
            <Button 
              variant="secondary" 
              className="mt-6"
              onClick={() => { setSearch(''); setCategory('All'); }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button 
                  variant="secondary" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <span className="text-sm font-medium text-text-secondary">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="secondary" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Events;
