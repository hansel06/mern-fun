import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      login(response.token, response.user);
      
      // Navigate to returnUrl if it exists, otherwise default to /events
      const searchParams = new URLSearchParams(location.search);
      const returnUrl = searchParams.get('returnUrl');
      navigate(returnUrl || '/events');
      
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface-elevated p-8 md:p-10 rounded-3xl shadow-xl border border-border">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-text-primary tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to your account to continue
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              error={error?.toLowerCase().includes('password') || error?.toLowerCase().includes('invalid') ? error : undefined}
            />
          </div>

          {/* Catch-all error for general failures */}
          {error && !error.toLowerCase().includes('email') && !error.toLowerCase().includes('password') && !error.toLowerCase().includes('invalid') && (
            <div className="text-sm text-danger text-center bg-danger/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-lg"
              isLoading={loading}
            >
              Sign In
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:text-primary-light transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
