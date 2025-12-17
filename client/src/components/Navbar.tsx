import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/events" className="nav-logo">
          Event Platform
        </Link>
        <div className="nav-menu">
          <Link to="/events" className="nav-link">
            Events
          </Link>
          {user ? (
            <>
              <Link to="/create-event" className="nav-link">
                Create Event
              </Link>
              <span className="nav-user">Hello, {user.name}</span>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-button">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

