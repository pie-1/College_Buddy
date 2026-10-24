import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Grid, List, ChevronLeft, ChevronRight, PackageOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import ItemCard from '../components/items/ItemCard';
import ItemFilters from '../components/items/ItemFilters';
import Loader from '../components/common/Loader';
import { getItems } from '../api/item.api';
import toast from 'react-hot-toast';

const Catalogue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  
  // Use URL params for filters so they persist on refresh
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    listingType: searchParams.get('type') || 'all',
    sortBy: searchParams.get('sort') || 'newest',
  });

  // Fetch data from API
  const fetchCatalogue = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page: pagination.page,
        limit: 9,
        ...(filters.search && { search: filters.search }),
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.listingType !== 'all' && { listingType: filters.listingType }),
      };

      const data = await getItems(queryParams);
      setItems(data.data);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        total: data.total,
      });
    } catch (error) {
      toast.error('Failed to load items. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when filters/page change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatalogue();
    }, 300); // 300ms debounce for search
    return () => clearTimeout(timer);
  }, [filters, pagination.page]);

  // Sync filters to URL
  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category !== 'all') params.category = filters.category;
    if (filters.listingType !== 'all') params.type = filters.listingType;
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on new filter
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-custom section-padding pt-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Explore <span className="text-primary-600">Catalogue</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-[15px] max-w-lg">
            Discover books, tools, and resources shared by your peers. Rent, buy, or borrow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1 shadow-inner">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-[#111128] text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
              <Grid size={18} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-[#111128] text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
              <List size={18} />
            </button>
          </div>

          <Link to="/add-item">
            <Button variant="primary" className="shadow-lg shadow-primary-500/20">
              <Plus size={18} /> Share Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Component */}
      <div className="mb-8">
        <ItemFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-[14px] font-medium text-gray-500 dark:text-gray-400">
          Showing <span className="text-gray-900 dark:text-white">{items.length}</span> of {pagination.total} items
        </p>
        {pagination.totalPages > 1 && (
          <p className="text-[14px] font-medium text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </p>
        )}
      </div>

      {/* Content Section */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loader />
          </motion.div>
        ) : items.length > 0 ? (
          <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {items.map((item) => (
                <ItemCard key={item._id} item={item} viewMode={viewMode} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 bg-white dark:bg-[#111128] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageOpen size={40} className="text-gray-400" />
            </div>
            <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white">No items found</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              We couldn't find anything matching your search. Try adjusting your filters.
            </p>
            <Button variant="secondary" onClick={() => handleFilterChange({ search: '', category: 'all', listingType: 'all' })} className="mt-6">
              Clear all filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-600 dark:text-gray-300"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-sm font-medium text-gray-500 px-4">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-600 dark:text-gray-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalogue;