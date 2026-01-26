import { Link } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { type ThemeId } from '../utils/themeManager';

export function Header() {
  const { user, logout } = useAuth();
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-indigo-400">
            TypeSpeed
          </Link>

          <div className="flex items-center gap-4">
            <select
              value={currentTheme}
              onChange={(e) => setTheme(e.target.value as ThemeId)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {availableThemes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>

            {user ? (
              <>
                <Link
                  to="/settings"
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <Settings className="w-5 h-5" />
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{user.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}