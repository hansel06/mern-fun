import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import PageWrapper from './components/PageWrapper';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/events" element={<PageWrapper><Events /></PageWrapper>} />
        <Route path="/events/:id" element={<PageWrapper><EventDetail /></PageWrapper>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper><Dashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageWrapper><Profile /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <PageWrapper><CreateEvent /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/edit"
          element={
            <ProtectedRoute>
              <PageWrapper><EditEvent /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>

            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <AnimatedRoutes />
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
