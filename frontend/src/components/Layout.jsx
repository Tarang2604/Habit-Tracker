import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <h1 className="text-2xl font-bold text-indigo-600">Habit Tracker</h1>
            </div>

            {user && (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-gray-700 font-medium">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}

            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
          </div>

          {mobileMenuOpen && user && (
            <div className="md:hidden pb-4 border-t">
              <p className="text-gray-700 font-medium py-2">Hi, {user.name}</p>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
