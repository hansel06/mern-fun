import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import ThemeToggle from './ui/ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="sticky top-4 z-50 px-4 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto bg-surface-elevated/70 backdrop-blur-xl border border-border shadow-lg rounded-2xl transition-colors duration-300 pointer-events-auto"
      >
        <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-primary tracking-tight">EventSphere</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/events" className="text-text-secondary hover:text-primary font-medium transition-colors">
              Events
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-text-secondary hover:text-primary font-medium transition-colors">
                  Dashboard
                </Link>
                <div className="relative group">
                  <div className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-primary transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-surface-elevated rounded-md shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-text-primary hover:bg-surface">
                      Profile
                    </Link>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-danger hover:bg-surface"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-text-secondary hover:text-primary font-medium transition-colors">
                  Login
                </Link>
                <Link to="/signup">
                  <Button variant="primary" className="py-2 px-4">Sign Up</Button>
                </Link>
              </div>
            )}
            
            {/* Dark Mode Toggle Desktop */}
            <div className="pl-4 border-l border-border flex items-center">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-secondary hover:text-primary p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-elevated/95 backdrop-blur-xl border-t border-border overflow-hidden rounded-b-2xl transition-colors duration-300"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                to="/events" 
                className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-danger hover:bg-surface"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-surface"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Navbar;
