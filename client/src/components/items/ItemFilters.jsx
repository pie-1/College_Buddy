import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '../common/Button';

const ItemFilters = ({
  onFilterChange,
  initialFilters = {},
  className = '',
}) => {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    department: initialFilters.department || 'all',
    availability: initialFilters.availability || 'all',
    sortBy: initialFilters.sortBy || 'newest',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'computer', label: '💻 Computer' },
    { value: 'civil', label: '🏗️ Civil' },
    { value: 'architecture', label: '🏛️ Architecture' },
    { value: 'common', label: '📚 Common' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'az', label: 'A-Z' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange?.(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      department: 'all',
      availability: 'all',
      sortBy: 'newest',
    });
  };

  const hasActiveFilters = filters.search || filters.department !== 'all' || filters.availability !== 'all';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar - Always Visible */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search items, tags, or users..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full px-4 py-2.5 pl-11 bg-white dark:bg-primary-900/30 border-2 border-primary-200 dark:border-primary-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="!px-4 !py-2.5"
        >
          <Filter size={18} />
          {isExpanded ? 'Hide' : 'Filter'}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            className="!px-4 !py-2.5"
          >
            <X size={18} />
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800/50 animate-slide-down">
          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1.5">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-primary-900/30 border-2 border-primary-200 dark:border-primary-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1.5">
              Availability
            </label>
            <select
              value={filters.availability}
              onChange={(e) => handleChange('availability', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-primary-900/30 border-2 border-primary-200 dark:border-primary-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
            >
              <option value="all">All Items</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1.5">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-primary-900/30 border-2 border-primary-200 dark:border-primary-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemFilters;