import { Globe2, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function Navigation() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Don't show navigation on landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <Globe2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">FTS</span>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}