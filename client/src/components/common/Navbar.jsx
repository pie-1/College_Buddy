import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Home, BookOpen, Calendar, Briefcase, Plus, MessageCircle, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-primary-200/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/Buddy-logo.png"
              alt="CollegeBuddy"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-primary-800 font-display">
              College<span className="text-primary-500">Buddy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 px-4 py-2 pl-10 text-sm bg-primary-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </form>

            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-xl hover:bg-primary-50 transition-all"
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
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition"
                >
                  <Plus size={18} /> Share
                </Link>
                <Link to="/inbox" className="p-2 text-gray-600 hover:text-primary-600 rounded-xl hover:bg-primary-50 transition relative">
                  <MessageCircle size={20} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    3
                  </span>
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 bg-primary-50 rounded-xl hover:bg-primary-100 transition">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-1">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-3">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 text-sm bg-primary-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </form>

            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition"
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
                  className="flex items-center gap-3 px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-xl transition"
                >
                  <Plus size={20} /> Share an Item
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-primary-50 rounded-xl transition"
                >
                  <User size={20} /> Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition w-full"
                >
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 bg-primary-600 text-white rounded-xl text-center font-medium"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;