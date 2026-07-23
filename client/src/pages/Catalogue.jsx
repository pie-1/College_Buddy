import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';
import ItemCard from '../components/items/ItemCard';
import ItemFilters from '../components/items/ItemFilters';
import toast from 'react-hot-toast';

// Mock data - Replace with real API call
const MOCK_ITEMS = [
  {
    id: 1,
    title: 'Data Structures Textbook',
    description: 'Comprehensive DSA textbook covering arrays, linked lists, trees, graphs, and algorithms. Perfect for CS students.',
    department: 'computer',
    owner: 'Alice Johnson',
    location: 'Library, 2nd Floor',
    available: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    image: null,
    tags: ['textbook', 'computer science', 'dsa'],
  },
  {
    id: 2,
    title: 'Engineering Calculator',
    description: 'TI-84 Plus graphing calculator with advanced engineering functions. Includes case and charging cable.',
    department: 'civil',
    owner: 'Bob Smith',
    location: 'Engineering Building, Room 301',
    available: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    image: null,
    tags: ['calculator', 'engineering', 'math'],
  },
  {
    id: 3,
    title: 'Architecture Portfolio Template',
    description: 'Professional portfolio template for architecture students. Includes InDesign files and mockup examples.',
    department: 'architecture',
    owner: 'Carol Davis',
    location: 'Studio A, Architecture Building',
    available: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    image: null,
    tags: ['portfolio', 'architecture', 'design'],
  },
  {
    id: 4,
    title: 'College Survival Guide',
    description: 'Tips, resources, and advice for new students. Covers study habits, time management, and campus life.',
    department: 'common',
    owner: 'David Wilson',
    location: 'Student Center, Room 105',
    available: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    image: null,
    tags: ['guide', 'student life', 'tips'],
  },
  {
    id: 5,
    title: 'React Native Development Kit',
    description: 'Complete starter kit for React Native app development with Expo, navigation, and UI components.',
    department: 'computer',
    owner: 'Emma Brown',
    location: 'CS Lab, Building B',
    available: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    image: null,
    tags: ['react', 'mobile', 'development'],
  },
  {
    id: 6,
    title: 'Structural Analysis Software',
    description: 'Professional structural analysis software for civil engineering projects. Student license included.',
    department: 'civil',
    owner: 'Frank Miller',
    location: 'Engineering Building, Room 205',
    available: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    image: null,
    tags: ['software', 'structural', 'engineering'],
  },
];

const Catalogue = () => {
  // State
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    availability: 'all',
    sortBy: 'newest',
  });

  // Pagination
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Load mock data
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setItems(MOCK_ITEMS);
        setFilteredItems(MOCK_ITEMS);
      } catch (error) {
        toast.error('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Filter and sort items whenever filters change
  useEffect(() => {
    let result = [...items];

    // 1. Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
          item.owner.toLowerCase().includes(searchTerm)
      );
    }

    // 2. Department filter
    if (filters.department !== 'all') {
      result = result.filter((item) => item.department === filters.department);
    }

    // 3. Availability filter
    if (filters.availability === 'available') {
      result = result.filter((item) => item.available === true);
    } else if (filters.availability === 'unavailable') {
      result = result.filter((item) => item.available === false);
    }

    // 4. Sorting
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'popular':
        // Mock popularity - just random for demo
        result.sort((a, b) => (a.id % 3) - (b.id % 3));
        break;
      case 'az':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredItems(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, items]);

  // Handle filter changes from ItemFilters component
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle like button
  const handleLike = (itemId) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, isLiked: !item.isLiked }
          : item
      )
    );
    toast.success('Item saved! ❤️');
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of results
    document.getElementById('catalogue-results')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // Generate page numbers
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="container-custom section-padding">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="h-8 w-48 bg-primary-200 rounded-lg"></div>
              <div className="h-4 w-64 bg-primary-200 rounded-lg mt-2"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-24 bg-primary-200 rounded-xl"></div>
              <div className="h-10 w-32 bg-primary-200 rounded-xl"></div>
            </div>
          </div>

          {/* Filters Skeleton */}
          <div className="h-14 bg-primary-200 rounded-xl mb-6"></div>

          {/* Items Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card">
                <div className="aspect-video bg-primary-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-primary-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-primary-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-primary-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom section-padding">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-gradient">
            Catalogue
          </h1>
          <p className="text-primary-500 dark:text-primary-400 text-sm">
            Browse items shared by your college community
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-primary-100 dark:bg-primary-800/50 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-primary-700 shadow-sm'
                  : 'hover:bg-white/50 dark:hover:bg-primary-700/50'
              }`}
              aria-label="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-primary-700 shadow-sm'
                  : 'hover:bg-white/50 dark:hover:bg-primary-700/50'
              }`}
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>

          <Link to="/add-item">
            <Button variant="primary" size="sm">
              <Plus size={18} /> Share Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <ItemFilters onFilterChange={handleFilterChange} />

      {/* Results Summary */}
      <div
        id="catalogue-results"
        className="flex justify-between items-center mt-6 mb-4"
      >
        <p className="text-sm text-primary-500 dark:text-primary-400">
          Showing <span className="font-semibold text-primary-700 dark:text-primary-300">{filteredItems.length}</span> items
          {filters.search && (
            <span className="ml-1">
              for "<span className="font-medium">{filters.search}</span>"
            </span>
          )}
        </p>

        {filteredItems.length > 0 && (
          <p className="text-xs text-primary-400 dark:text-primary-500">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Items Grid/List */}
      {filteredItems.length > 0 ? (
        <>
          <div
            className={`grid ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'grid-cols-1 gap-4'
            }`}
          >
            {currentItems.map((item) => (
              <ItemCard
                key={item.id}
                {...item}
                onLike={() => handleLike(item.id)}
                isLiked={item.isLiked || false}
                className={viewMode === 'list' ? 'flex flex-row' : ''}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-primary-200 hover:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl font-medium transition ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-primary-100 text-primary-600'
                  }`}
                >
                  {page}
                </button>
              ))}

              {totalPages > 5 && pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  <span className="text-primary-400">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="w-10 h-10 rounded-xl font-medium hover:bg-primary-100 text-primary-600 transition"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-primary-200 hover:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        // Empty State
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-display text-xl font-semibold text-primary-800 dark:text-primary-100">
            No items found
          </h3>
          <p className="text-primary-500 dark:text-primary-400 mt-2 max-w-md mx-auto">
            {filters.search || filters.department !== 'all' || filters.availability !== 'all'
              ? "Try adjusting your filters or search terms"
              : "Be the first to share an item with your community!"}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {/* Clear filters button */}
            {(filters.search || filters.department !== 'all' || filters.availability !== 'all') && (
              <Button
                variant="secondary"
                onClick={() => {
                  setFilters({
                    search: '',
                    department: 'all',
                    availability: 'all',
                    sortBy: 'newest',
                  });
                }}
              >
                Clear Filters
              </Button>
            )}
            <Link to="/add-item">
              <Button variant="primary">Share an Item</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogue;


function Catalogue() {
  return (
    <div>
      <h1>Catalogue Page</h1>
    </div>
  );
}

export default Catalogue;
 
