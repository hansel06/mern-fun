import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { SearchX, ArrowLeft, Home } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const NotFound = () => {
  return (
    <PageWrapper>
      <div className="min-h-[80vh] bg-surface flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-2xl shadow-sm border border-border">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <SearchX className="w-12 h-12" />
            </div>
          </div>
          
          <div>
            <h1 className="mt-6 text-4xl font-extrabold text-text-primary tracking-tight">404</h1>
            <h2 className="mt-2 text-2xl font-bold text-text-primary">Page not found</h2>
            <p className="mt-4 text-text-secondary">
              Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full flex items-center justify-center gap-2">
                <Home className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
            <Link to="/events" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
