import React from 'react';
import { Globe, Search, UserCircle, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to={'/'} className="flex items-center space-x-2 flex-shrink-0">
              <Globe className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">FTS</span>
            </Link>

            {/* Navigation Links */}
            {user && (
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/exchange-rates" className="text-gray-600 hover:text-gray-900">
                  Exchange Rates
                </Link>
                <Link to="/all-trades" className="text-gray-600 hover:text-gray-900">
                  All Trades
                </Link>
              </div>
            )}
          </div>

          {/* Center Section: Search Bar */}
          {user && (
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search markets..."
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}

          {/* Right Section: Create Trade Button and User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <Link 
                to="/create-trade" 
                className="hidden md:flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Create Trade</span>
              </Link>
            )}
            
            {user ? (
              <div className="relative group">
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <UserCircle className="h-8 w-8 text-gray-700" />
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </Link>
                  <Link to="/create-trade" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hidden">
                    Create Trade
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}