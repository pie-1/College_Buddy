import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';
import ItemCard from '../components/items/ItemCard';
import ItemFilters from '../components/items/ItemFilters';
import api from '../api/client';
import toast from 'react-hot-toast';

const Catalogue = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    availability: 'all',
    sortBy: 'newest',
  });

  // Fetch real data from backend
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const response = await api.get('/items');
        // Backend returns { data: [...] }
        setItems(response.data.data || []);
      } catch (error) {
        console.error('Failed to load items', error);
        toast.error('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // 1. Search
    if (filters.search.trim()) {
      const term = filters.search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(term)) ||
          item.owner?.name?.toLowerCase().includes(term)
      );
    }

    // 2. Department (Matches 'dept' from your backend)
    if (filters.department !== 'all') {
      result = result.filter(
        (item) => item.owner?.dept?.toLowerCase() === filters.department.toLowerCase()
      );
    }

    // 3. Availability
    if (filters.availability === 'available') {
      result = result.filter((item) => item.status === 'available');
    } else if (filters.availability === 'unavailable') {
      result = result.filter((item) => item.status !== 'available');
    }

    // 4. Sort
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'az':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [filters, items]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="container-custom section-padding">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-primary-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card">
                <div className="aspect-video bg-primary-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-primary-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-primary-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom section-padding">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-gradient">Catalogue</h1>
          <p className="text-primary-500 text-sm">Browse items shared by your college community</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-primary-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List size={18} />
            </button>
          </div>

          <Link to="/items/new">
            <Button variant="primary" size="sm">
              <Plus size={18} /> Share Item
            </Button>
          </Link>
        </div>
      </div>

      <ItemFilters onFilterChange={handleFilterChange} />

      <div className="mt-6 mb-4">
        <p className="text-sm text-primary-500">
          Showing <span className="font-semibold text-primary-700">{filteredItems.length}</span> items
        </p>
      </div>

      {filteredItems.length > 0 ? (
        <div
          className={`grid ${
            viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'
          }`}
        >
          {filteredItems.map((item) => (
            <ItemCard
              key={item._id}
              id={item._id}
              title={item.title}
              description={item.description}
              image={item.images?.[0]}
              department={item.owner?.dept}
              owner={item.owner?.name}
              available={item.status === 'available'}
              createdAt={item.createdAt}
              className={viewMode === 'list' ? 'flex flex-row' : ''}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-display text-xl font-semibold text-primary-800">No items found</h3>
          <p className="text-primary-500 mt-2">Be the first to share an item!</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link to="/items/new">
              <Button variant="primary">Share an Item</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogue;