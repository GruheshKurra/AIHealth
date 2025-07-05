import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import {
  Home,
  Leaf,
  Menu,
  X,
  ChevronDown,
  FlaskConical,
  Bug,
  FileText,
  MessageCircle,
  TrendingUp,
  MapPin,
  Heart,
  Wrench,
  LogIn
} from 'lucide-react';

const DropdownMenu = ({ title, items, isOpen, onClick }) => {
  const location = useLocation();

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="flex items-center space-x-1 px-3 py-2 rounded-lg text-green-100 hover:bg-green-800/50 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-1 w-48 bg-green-900 rounded-lg shadow-xl ring-1 ring-green-800 overflow-hidden z-50"
          >
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2.5 hover:bg-green-800 transition-colors ${location.pathname === item.path ? 'bg-green-800 text-green-200' : 'text-green-100'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const { user } = useUser();

  const dropdownMenus = {
    analysis: {
      title: 'Analysis',
      items: [
        { path: '/plant-analysis', icon: Leaf, label: 'Plant Analysis' },
        { path: '/pest-analysis', icon: Bug, label: 'Pest Analysis' },
        { path: '/soil-analysis', icon: FlaskConical, label: 'Soil Analysis' }
      ]
    },
    services: {
      title: 'Services',
      items: [
        { path: '/price-prediction', icon: TrendingUp, label: 'Price Prediction' },
        { path: '/land-lease', icon: MapPin, label: 'Land Lease' },
        { path: '/equipment-lease', icon: Wrench, label: 'Equipment Lease' }
      ]
    },
    community: {
      title: 'Community',
      items: [
        { path: '/forum', icon: MessageCircle, label: 'Forum' },
        { path: '/news', icon: FileText, label: 'News' },
        { path: '/farmer-support', icon: Heart, label: 'Support Farmers' }
      ]
    }
  };

  const handleDropdownClick = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  React.useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className="bg-green-900/95 backdrop-blur-sm sticky top-0 z-50 border-b border-green-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <Leaf className="w-6 h-6 text-green-400" />
            <span className="text-green-50 font-bold text-xl">FarmCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${location.pathname === '/'
                  ? 'bg-green-800 text-green-200'
                  : 'text-green-100 hover:bg-green-800/50'
                }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {Object.entries(dropdownMenus).map(([key, menu]) => (
              <DropdownMenu
                key={key}
                title={menu.title}
                items={menu.items}
                isOpen={openDropdown === key}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdownClick(key);
                }}
              />
            ))}
          </div>

          {/* Authentication */}
          <div className="hidden md:flex items-center space-x-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center space-x-3">
                {user && (
                  <span className="text-green-100 text-sm">
                    Welcome, {user.firstName || user.username || 'User'}!
                  </span>
                )}
                <UserButton />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-green-100 hover:bg-green-800/50 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden border-t border-green-800 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Authentication */}
              <div className="mb-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center justify-between">
                    {user && (
                      <span className="text-green-100 text-sm">
                        Welcome, {user.firstName || user.username || 'User'}!
                      </span>
                    )}
                    <UserButton />
                  </div>
                </SignedIn>
              </div>

              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${location.pathname === '/'
                    ? 'bg-green-800 text-green-200'
                    : 'text-green-100 hover:bg-green-800/50'
                  }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              {Object.entries(dropdownMenus).map(([key, menu]) => (
                <div key={key} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-green-400">
                    {menu.title}
                  </div>
                  {menu.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-6 py-2 rounded-lg ${location.pathname === item.path
                          ? 'bg-green-800 text-green-200'
                          : 'text-green-100 hover:bg-green-800/50'
                        }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
