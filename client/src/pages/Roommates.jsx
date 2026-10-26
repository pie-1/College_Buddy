import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, DollarSign, MessageCircle, Search, Home, Loader, Sparkles } from 'lucide-react';
import { getRoommates } from '../api/user.api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Roommates = () => {
  const { user: currentUser } = useAuth();
  const [roommates, setRoommates] = useState([]);
  const [filteredRoommates, setFilteredRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [maxBudget, setMaxBudget] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRoommates();
        setRoommates(data);
        setFilteredRoommates(data);
      } catch (error) {
        toast.error("Failed to load roommates.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = roommates;
    if (searchTerm) {
      result = result.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.roommateDetails?.preferredLocation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (deptFilter !== 'all') result = result.filter(r => r.dept === deptFilter);
    if (maxBudget) result = result.filter(r => r.roommateDetails?.budget <= Number(maxBudget));
    setFilteredRoommates(result);
  }, [searchTerm, deptFilter, maxBudget, roommates]);

  const calculateMatch = (roommate) => {
    if (!roommate.interests || !currentUser?.interests) return 70; 
    const shared = roommate.interests.filter(i => currentUser.interests.includes(i));
    return Math.min(70 + (shared.length * 10), 99); 
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-primary-500" size={40} /></div>;

  return (
    // CHANGED BACKGROUND: Soft warm cream/orange gradient
    <div className="min-h-screen bg-[#FFF9F5] dark:bg-primary-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* HERO SECTION WITH IMAGE */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex-1 text-center md:text-left">
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Find Your Compatible <br className="hidden md:block"/>
              <span className="text-primary-600">Flatmate.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-gray-600 dark:text-gray-400 max-w-lg text-lg mb-6">
              Discover rooms, share flats, and find the perfect roommate from your college community. 100% Brokerage Free.
            </motion.p>
          </div>
          
          {/* YOUR IMAGE */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex justify-center md:justify-end">
            <img 
              src="/roommates-hero.png" 
              alt="Roommate Illustration" 
              className="w-full max-w-sm md:max-w-md object-contain drop-shadow-2xl animate-float"
            />
          </motion.div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-primary-800 p-5 rounded-3xl shadow-xl border border-gray-100 dark:border-primary-700 mb-10 flex flex-col md:flex-row gap-4 items-center relative z-10">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by location or name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-primary-900 border border-gray-200 dark:border-primary-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={deptFilter} 
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-5 py-3.5 bg-gray-50 dark:bg-primary-900 border border-gray-200 dark:border-primary-700 rounded-2xl focus:outline-none font-medium text-gray-700 dark:text-gray-300"
            >
              <option value="all">Any Department</option>
              <option value="COMPUTER">Computer</option>
              <option value="BIT">BIT</option>
              <option value="CIVIL">Civil</option>
              <option value="ARCHI">Architecture</option>
            </select>

            <input 
              type="number" 
              placeholder="Max Budget (NPR)" 
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-40 px-5 py-3.5 bg-gray-50 dark:bg-primary-900 border border-gray-200 dark:border-primary-700 rounded-2xl focus:outline-none font-medium text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        {/* Roommate Grid */}
        <AnimatePresence>
          {filteredRoommates.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRoommates.map((user) => {
                const matchPercent = calculateMatch(user);
                return (
                  <motion.div 
                    key={user._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -8 }}
                    className="bg-white dark:bg-primary-800 rounded-3xl p-6 shadow-md hover:shadow-2xl border border-gray-100 dark:border-primary-700 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={12} /> {matchPercent}% Match
                    </div>

                    <div className="flex items-center gap-4 mb-5 mt-2">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-700 dark:to-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-2xl shadow-inner">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">{user.name}</h3>
                        <p className="text-sm font-medium text-gray-500">{user.dept} • Year {user.year}</p>
                      </div>
                    </div>

                    {user.bio && <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-2 italic">"{user.bio}"</p>}

                    <div className="space-y-3 mb-6 bg-gray-50 dark:bg-primary-900/50 p-4 rounded-2xl">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1"><MapPin size={14}/> Location</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{user.roommateDetails?.preferredLocation || 'Anywhere'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1"><DollarSign size={14}/> Budget</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">NPR {user.roommateDetails?.budget || 'Flexible'}/mo</span>
                      </div>
                    </div>

                    <Link to={`/profile/${user._id}`} className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md shadow-primary-500/20">
                      <MessageCircle size={18} /> Connect & View Profile
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white dark:bg-primary-800 rounded-3xl border border-gray-100 dark:border-primary-700 shadow-sm">
              <div className="w-24 h-24 bg-gray-50 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home size={40} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No roommates found</h3>
              <p className="text-gray-500 max-w-md mx-auto">We couldn't find anyone matching your filters. Try adjusting your search criteria.</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Roommates;