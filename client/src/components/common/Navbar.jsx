import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Home, 
  BookOpen, 
  Calendar, 
  Briefcase, 
  Plus, 
  MessageCircle, 
  Search,
  ChevronDown,
  Settings,
  HelpCircle,
  Shield,
  Sun,
  Moon,
  Bell,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Handle click outside profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { to: '/catalogue', label: 'Browse', icon: BookOpen },
    { to: '/events', label: 'Events', icon: Calendar },
    { to: '/projects', label: 'Projects', icon: Briefcase },
  ];

  // Profile dropdown items
  const profileItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/profile', label: 'My Profile', icon: UserCircle },
    { to: '/inbox', label: 'Inbox', icon: MessageCircle, badge: 3 },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-primary-900/90 backdrop-blur-lg border-b border-primary-200/30 dark:border-primary-800/30 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img
              src="/Buddy-logo.png"
              alt="CollegeBuddy"
              className="w-10 h-10 object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-xl font-bold text-primary-800 dark:text-primary-100 font-display">
              College<span className="text-primary-500">Buddy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center px-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search items, people, or departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 text-sm bg-primary-50 dark:bg-primary-800/50 border border-primary-200 dark:border-primary-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:focus:ring-primary-400/30 transition placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
            </form>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800/50 transition-all"
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}

            {user && (
              <>
                <Link
                  to="/add-item"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition shadow-sm hover:shadow-md"
                >
                  <Plus size={18} /> Share
                </Link>
                <Link to="/inbox" className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800/50 transition relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-pulse">
                    3
                  </span>
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800/50 transition"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="relative ml-2" ref={profileRef}>
                {/* Profile Button */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-800/50 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-800 transition"
                >
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-semibold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-primary-800 rounded-xl shadow-xl border border-primary-200/30 dark:border-primary-700/30 overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-primary-200/30 dark:border-primary-700/30">
                        <p className="font-semibold text-primary-800 dark:text-primary-100">
                          {user.name}
                        </p>
                        <p className="text-xs text-primary-500 dark:text-primary-400">
                          {user.email}
                        </p>
                        {user.department && (
                          <span className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-700/50 text-primary-600 dark:text-primary-300 rounded-full mt-1 inline-block">
                            {user.department}
                          </span>
                        )}
                      </div>

                      {/* Profile Links */}
                      <div className="py-1">
                        {profileItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-700/50 transition"
                            >
                              <span className="flex items-center gap-3">
                                <Icon size={16} />
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-primary-200/30 dark:border-primary-700/30 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition w-full"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800/50 rounded-xl text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-primary-800/50 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden py-4 border-t border-primary-200/30 dark:border-primary-800/30 space-y-1"
            >
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 text-sm bg-primary-50 dark:bg-primary-800/50 border border-primary-200 dark:border-primary-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </form>

              {/* Mobile Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-800/50 rounded-xl transition w-full"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>

              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800/50 rounded-xl transition"
                  >
                    <Icon size={20} />
                    {link.label}
                  </Link>
                );
              })}

              {user ? (
                <>
                  <Link
                    to="/add-item"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800/50 rounded-xl transition"
                  >
                    <Plus size={20} /> Share an Item
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-800/50 rounded-xl transition"
                  >
                    <User size={20} /> Dashboard
                  </Link>
                  <Link
                    to="/inbox"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-800/50 rounded-xl transition"
                  >
                    <span className="flex items-center gap-3">
                      <MessageCircle size={20} /> Inbox
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      3
                    </span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-800/50 rounded-xl transition"
                  >
                    <UserCircle size={20} /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition w-full"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-center text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800/50 rounded-xl transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-center bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;