import { ArrowRight, BarChart3, Coins, Globe2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Global Trading Made Simple
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                Trade currencies with confidence using our secure and intuitive foreign trading platform.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Globe2 className="w-full h-64 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose FTS?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Link 
            to="/exchange-rates" 
            className="p-6 bg-white rounded-lg shadow-lg transition-all hover:shadow-xl group"
          >
            <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold">Real-Time Trading</h3>
              <ArrowRight className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-gray-600">
              Access live market rates and execute trades instantly with our advanced trading platform.
            </p>
          </Link>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <Lock className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Secure Platform</h3>
            <p className="text-gray-600">
              Trade with confidence knowing your transactions are protected by enterprise-grade security.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <Coins className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Multiple Currencies</h3>
            <p className="text-gray-600">
              Trade a wide range of global currencies with competitive exchange rates.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe2 className="h-8 w-8" />
                <span className="text-xl font-bold">FTS</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner in foreign currency trading.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/register" className="text-gray-400 hover:text-white">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">support@fts.com</li>
                <li className="text-gray-400">+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} FTS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}