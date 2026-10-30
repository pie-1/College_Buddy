import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, LogOut, Home, BookOpen, Calendar, Briefcase, 
  Plus, MessageCircle, Search, ChevronDown, Settings, 
  Sun, Moon, Bell, UserCircle, Users, Package // ✅ Added Package here
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // Close dropdowns on route change
  useEffect(() => {
    setIsProfileOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

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

  // Dark mode logic
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { to: '/catalogue', label: 'Browse', icon: BookOpen },
    { to: '/my-listings', label: 'My Listings', icon: Package },
    { to: '/roommates', label: 'Roommates', icon: Home },
    { to: '/connections', label: 'Connections', icon: Users },
  ];

  const profileItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/profile', label: 'My Profile', icon: UserCircle },
    { to: '/events', label: 'Events', icon: Calendar },
    { to: '/projects', label: 'Projects', icon: Briefcase },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#090933]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="/Buddy-logo.png" alt="CollegeBuddy" className="w-9 h-9 object-contain transition-transform group-hover:scale-105" />
              <span className="text-[22px] font-bold text-[#090933] dark:text-white font-display tracking-tight">
                College<span className="text-primary-500">Buddy</span>
              </span>
            </Link>

            {/* Desktop Search - Centered */}
            <div className="hidden lg:flex flex-1 justify-center px-8">
              <form onSubmit={handleSearch} className="relative w-full max-w-md group">
                <input
                  type="text"
                  placeholder="Search textbooks, calculators, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 text-[15px] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
              </form>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="px-3 py-2 text-[15px] font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  {link.label}
                </Link>
              ))}

              <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-2"></div>

              {user && (
                <>
                  <Link to="/add-item" className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-full text-[14px] font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/20">
                    <Plus size={16} /> Share
                  </Link>
                  
                  <Link to="/chat" className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-colors relative">
                    <MessageCircle size={20} />
                  </Link>
                </>
              )}

              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {user ? (
                <div className="relative ml-2" ref={profileRef}>
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold shadow-inner">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-60 bg-white dark:bg-[#111128] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden"
                      >
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-[13px] text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="py-2">
                          {profileItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link key={item.to} to={item.to} className="flex items-center gap-3 px-5 py-2.5 text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <Icon size={17} /> {item.label}
                              </Link>
                            );
                          })}
                        </div>
                        <div className="border-t border-gray-100 dark:border-white/5 py-2">
                          <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-2.5 text-[14px] font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full">
                            <LogOut size={17} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3 ml-2">
                  <Link to="/login" className="text-[15px] font-medium text-gray-600 hover:text-primary-600 transition-colors">Log in</Link>
                  <Link to="/register" className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-[14px] font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm">Sign up</Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-600 dark:text-gray-300">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[72px] z-40 bg-white dark:bg-[#090933] md:hidden flex flex-col px-6 py-6 overflow-y-auto"
          >
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-11 text-[15px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </form>

            <div className="space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.to} to={link.to} className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-xl">
                    <Icon size={20} className="text-gray-400" /> {link.label}
                  </Link>
                );
              })}
              
              {user && (
                <Link to="/add-item" className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-primary-600 bg-primary-50 rounded-xl">
                  <Plus size={20} /> Share an Item
                </Link>
              )}
            </div>
            
            <div className="mt-auto pt-6 border-t border-gray-100">
               {user ? (
                 <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-red-600 w-full">
                   <LogOut size={20} /> Logout
                 </button>
               ) : (
                 <div className="flex flex-col gap-3">
                   <Link to="/login" className="w-full py-3 text-center text-lg font-medium border border-gray-200 rounded-xl">Log in</Link>
                   <Link to="/register" className="w-full py-3 text-center text-lg font-medium bg-gray-900 text-white rounded-xl">Sign up</Link>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;