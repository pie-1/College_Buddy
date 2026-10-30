import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client'; // Import your configured Axios instance
import { 
  Search, Filter, LayoutGrid, List, Plus, Package, 
  Loader2, AlertCircle, Trash2, Edit, Eye 
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch real items from backend
  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const response = await api.get('/items/my/items');
        setItems(response.data);
      } catch (err) {
        setError('Failed to load your listings. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyItems();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Handle Delete (connected to backend)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    
    const toastId = toast.loading('Deleting listing...');
    try {
      await api.delete(`/items/${id}`);
      setItems(items.filter(item => item._id !== id));
      toast.success('Listing deleted successfully', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to delete listing', { id: toastId });
    }
  };

  // Filter items by search query locally
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your listings</h2>
        <button onClick={() => navigate('/login')} className="bg-[#6c5ce7] hover:bg-[#5a4bcf] px-6 py-2 rounded-xl transition-colors">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white pt-24 pb-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-white mb-2">My Listings</h1>
            <p className="text-gray-400">Manage the items you have shared with the community.</p>
          </div>
          <Link to="/add-item" className="flex items-center gap-2 bg-[#6c5ce7] hover:bg-[#5a4bcf] text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-[#6c5ce7]/20">
            <Plus size={18} /> Share Item
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Search your listings by title or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1b26] border border-gray-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#6c5ce7] transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex bg-[#1a1b26] border border-gray-800 rounded-xl p-1">
              <button className="p-2 bg-gray-800 text-white rounded-lg"><LayoutGrid size={18} /></button>
              <button className="p-2 text-gray-500 hover:text-white rounded-lg transition-colors"><List size={18} /></button>
            </div>
            <button className="flex items-center gap-2 bg-[#1a1b26] border border-gray-800 text-gray-300 px-4 py-2 rounded-xl hover:text-white hover:border-gray-600 transition-colors">
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#6c5ce7]" size={40} />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="bg-[#1a1b26] border border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Package size={40} className="text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No listings found</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              {searchQuery 
                ? "No items match your search. Try different keywords." 
                : "You haven't shared any items yet. Start sharing with your peers and earn trust points!"}
            </p>
            {!searchQuery && (
              <Link to="/add-item" className="bg-[#6c5ce7] hover:bg-[#5a4bcf] text-white px-6 py-3 rounded-xl font-medium transition-colors">
                Create your first listing
              </Link>
            )}
          </div>
        )}

        {/* Grid Container */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-[#1a1b26] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-colors group">
                
                {/* Image Area */}
                <div className="relative aspect-[4/3] bg-[#252636] flex items-center justify-center p-4">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Package size={48} className="text-gray-600" />
                  )}
                  
                  {/* Status Badge */}
                  <span className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold backdrop-blur-sm ${
                    item.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>

                {/* Content Area */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[11px] font-bold tracking-wider text-[#6c5ce7] uppercase block">
                      {item.category}
                    </span>
                    {item.listingType === 'sell' && item.price && (
                      <span className="text-sm font-bold text-green-400">Rs. {item.price}</span>
                    )}
                    {item.listingType === 'borrow' && (
                      <span className="text-[11px] font-bold text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded">Borrow</span>
                    )}
                  </div>
                  
                  <h3 className="text-white font-medium truncate mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">{item.description}</p>
                  
                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-4 border-t border-gray-800">
                    <button 
                      onClick={() => navigate(`/items/${item._id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="px-3 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-medium transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyListings;