import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, UserPlus, MessageCircle, Filter, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import { mockUsers, departments, semesters, statuses } from '../mock/mockConnections';

export default function ConnectionsPage() {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { register, setValue, watch, handleSubmit, reset } = useForm({
    defaultValues: {
      departmentFilter: '',
      semesterFilter: '',
      statusFilter: '',
    },
  });

  const departmentFilter = watch('departmentFilter');
  const semesterFilter = watch('semesterFilter');
  const statusFilter = watch('statusFilter');

  // Filter logic
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.department.toLowerCase().includes(term)
      );
    }

    // Department filter
    if (departmentFilter) {
      filtered = filtered.filter((user) => user.department === departmentFilter);
    }

    // Semester filter
    if (semesterFilter) {
      filtered = filtered.filter((user) => user.semester === semesterFilter);
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((user) => user.studentStatus === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, departmentFilter, semesterFilter, statusFilter, users]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    reset({
      departmentFilter: '',
      semesterFilter: '',
      statusFilter: '',
    });
    setIsFilterOpen(false);
    toast.success('Filters cleared');
  };

  // Handle message
  const handleMessage = (user) => {
    toast.success(`Opening chat with ${user.name}...`);
    // Navigate to chat or open modal
  };

  // Handle connect
  const handleConnect = (user) => {
    toast.success(`Connection request sent to ${user.name}! 🎉`);
  };

  // Get active filters count
  const activeFiltersCount = [departmentFilter, semesterFilter, statusFilter].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-primary-800 font-display mb-2">
            Student <span className="text-primary-500">Connections</span>
          </h1>
          <p className="text-primary-500 text-lg">
            Connect with fellow students and alumni from your college community
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-primary-200/30"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition ${
                isFilterOpen || activeFiltersCount > 0
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              <Filter size={18} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-500 ml-auto">
              <Users size={18} className="mr-2" />
              Showing {filteredUsers.length} of {users.length} students
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                  {/* Department Filter */}
                  <select
                    {...register('departmentFilter')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>

                  {/* Semester Filter */}
                  <select
                    {...register('semesterFilter')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition"
                  >
                    <option value="">All Semesters</option>
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    {...register('statusFilter')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition"
                  >
                    <option value="">All Status</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition"
                  >
                    <X size={16} />
                    Clear all filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Users Grid */}
        <AnimatePresence>
          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-primary-200/30 hover:border-primary-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-primary-100"
                      />
                      {user.studentStatus === 'Passout/Alumni' && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                          Alumni
                        </span>
                      )}
                    </div>

                    {/* Name & Email */}
                    <h3 className="font-semibold text-lg text-primary-800 mt-3">{user.name}</h3>
                    <p className="text-gray-500 text-sm">{user.email}</p>

                    {/* Details */}
                    <div className="w-full space-y-2 my-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Department:</span>
                        <span className="font-medium text-primary-700">{user.department}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Semester:</span>
                        <span className="font-medium text-primary-700">{user.semester}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Status:</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.studentStatus === 'Regular Student'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {user.studentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => handleMessage(user)}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary-500 text-white py-2 px-3 rounded-xl hover:bg-primary-600 transition-colors font-medium text-sm"
                      >
                        <MessageCircle size={16} />
                        Message
                      </button>
                      <button
                        onClick={() => handleConnect(user)}
                        className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 py-2 px-3 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                      >
                        <UserPlus size={16} />
                        Connect
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl shadow-lg border border-primary-200/30"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">No students found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-primary-500 hover:text-primary-600 font-medium underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
