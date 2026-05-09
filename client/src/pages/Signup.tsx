import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);

    try {
      const response = await authAPI.signup({ name, email, password });
      login(response.token, response.user);
      navigate('/events');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-surface py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full space-y-8 bg-surface-elevated/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-border/50 relative z-10"
      >
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-text-primary tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Join EventSphere to start hosting events
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <Input
              id="name"
              type="text"
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              id="email"
              type="email"
              label="Email address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={error?.toLowerCase().includes('email') ? error : undefined}
            />
            
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Create a password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              error={error?.toLowerCase().includes('password') ? error : undefined}
            />
          </div>

          {/* Catch-all error for general failures */}
          {error && !error.toLowerCase().includes('email') && !error.toLowerCase().includes('password') && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-danger text-center bg-danger/10 p-3 rounded-xl border border-danger/20"
            >
              {error}
            </motion.div>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-lg"
              isLoading={loading}
            >
              Sign Up
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-light transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
