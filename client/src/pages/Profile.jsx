import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Building, 
  Calendar, 
  MapPin, 
  Award, 
  Edit, 
  Package,
  BookOpen,
  Users,
  Settings,
  Camera,
  Check,
  X,
  Loader
} from 'lucide-react';
import Button from '../components/common/Button';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    department: '',
    year: '',
    location: '',
  });

  // Mock user data (replace with API call)
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@college.edu.np',
    department: 'computer',
    year: '3',
    bio: 'Computer Science student passionate about AI and web development. Love helping fellow students with coding problems.',
    location: 'On Campus',
    profileImage: null,
    joinedDate: 'January 2025',
    stats: {
      itemsShared: 12,
      projectsJoined: 3,
      connections: 28,
      itemsBorrowed: 5,
    },
    recentItems: [
      { id: 1, title: 'Data Structures Textbook', department: 'Computer', time: '2 hours ago' },
      { id: 2, title: 'Engineering Calculator', department: 'Civil', time: '1 day ago' },
      { id: 3, title: 'Architecture Portfolio', department: 'Architecture', time: '3 days ago' },
    ],
  };

  const departmentMap = {
    computer: '💻 Computer Science',
    civil: '🏗️ Civil Engineering',
    architecture: '🏛️ Architecture',
    common: '📚 Common',
  };

  const yearMap = {
    '1': '1st Year',
    '2': '2nd Year',
    '3': '3rd Year',
    '4': '4th Year',
    '5': '5th Year',
  };

  useEffect(() => {
    // Check if viewing own profile
    const userIdParam = userId ? parseInt(userId) : null;
    if (userIdParam === currentUser?.id || (!userId && currentUser)) {
      setIsOwnProfile(true);
    }

    // Fetch user data (mock for now)
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const userData = userIdParam ? mockUser : { ...mockUser, ...currentUser };
        setProfileUser(userData);
        setFormData({
          name: userData.name || '',
          bio: userData.bio || '',
          department: userData.department || '',
          year: userData.year || '',
          location: userData.location || '',
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, currentUser]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form data when opening edit
      setFormData({
        name: profileUser?.name || '',
        bio: profileUser?.bio || '',
        department: profileUser?.department || '',
        year: profileUser?.year || '',
        location: profileUser?.location || '',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update profile logic here
      setProfileUser({ ...profileUser, ...formData });
      setIsEditing(false);
      // Show success message
      alert('Profile updated successfully! 🎉');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="container-custom section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="card text-center">
              <div className="w-24 h-24 rounded-full bg-primary-200 mx-auto" />
              <div className="h-6 bg-primary-200 rounded w-32 mx-auto mt-4" />
              <div className="h-4 bg-primary-200 rounded w-48 mx-auto mt-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container-custom section-padding"
    >
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div variants={itemVariants} className="card text-center relative">
          {/* Edit Button */}
          {isOwnProfile && (
            <button
              onClick={handleEditToggle}
              className="absolute top-4 right-4 p-2 bg-primary-100 hover:bg-primary-200 rounded-xl transition"
            >
              <Edit size={18} className="text-primary-600" />
            </button>
          )}

          {/* Profile Image */}
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto flex items-center justify-center text-3xl text-white font-bold">
              {profileUser?.name?.charAt(0) || 'U'}
            </div>
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 p-1.5 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition">
                <Camera size={14} />
              </button>
            )}
          </div>

          {/* User Info */}
          <h2 className="font-display text-2xl font-bold text-primary-800 mt-4">
            {profileUser?.name}
          </h2>
          <p className="text-primary-500">
            {departmentMap[profileUser?.department] || 'Student'}
            {profileUser?.year && ` • ${yearMap[profileUser.year]}`}
          </p>
          <p className="text-sm text-primary-400 mt-1">
            Member since {profileUser?.joinedDate}
          </p>

          {/* Bio */}
          {profileUser?.bio && (
            <p className="mt-3 text-primary-600 max-w-lg mx-auto text-sm">
              {profileUser.bio}
            </p>
          )}
        </motion.div>

        {/* Edit Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card mt-6"
          >
            <h3 className="font-semibold text-primary-800 mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1.5">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1.5">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
                >
                  <option value="computer">💻 Computer Science</option>
                  <option value="civil">🏗️ Civil Engineering</option>
                  <option value="architecture">🏛️ Architecture</option>
                  <option value="common">📚 Common</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1.5">
                  Year of Study
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., On Campus, Library"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? <Loader size={18} className="animate-spin" /> : <Check size={18} />}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="btn-secondary"
                >
                  <X size={18} /> Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Items Shared', value: profileUser?.stats?.itemsShared || 0, icon: Package, color: 'primary' },
            { label: 'Projects Joined', value: profileUser?.stats?.projectsJoined || 0, icon: BookOpen, color: 'secondary' },
            { label: 'Connections', value: profileUser?.stats?.connections || 0, icon: Users, color: 'green' },
            { label: 'Items Borrowed', value: profileUser?.stats?.itemsBorrowed || 0, icon: Award, color: 'accent' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card text-center">
                <div className={`p-2 rounded-xl bg-${stat.color}-100 inline-block mb-2`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-500`} />
                </div>
                <div className="text-xl font-bold text-primary-800">
                  {stat.value}
                </div>
                <div className="text-xs text-primary-500">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Contact Info */}
        <motion.div variants={itemVariants} className="card mt-6">
          <h3 className="font-semibold text-primary-800 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-primary-600">
              <Mail size={18} />
              <span>{profileUser?.email}</span>
            </div>
            {profileUser?.location && (
              <div className="flex items-center gap-3 text-primary-600">
                <MapPin size={18} />
                <span>{profileUser.location}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-primary-600">
              <Calendar size={18} />
              <span>Joined {profileUser?.joinedDate}</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Items */}
        {profileUser?.recentItems && profileUser.recentItems.length > 0 && (
          <motion.div variants={itemVariants} className="card mt-6">
            <h3 className="font-semibold text-primary-800 mb-4">Recent Items</h3>
            <div className="space-y-3">
              {profileUser.recentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-primary-50 dark:bg-primary-800/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-800/50 transition cursor-pointer"
                >
                  <div className="w-10 h-10 bg-primary-200 rounded-lg flex items-center justify-center text-xl">
                    📚
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-primary-800 dark:text-primary-100 text-sm">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-primary-500">
                      <span>{item.department}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <Link
                    to={`/items/${item.id}`}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons for Own Profile */}
        {isOwnProfile && !isEditing && (
          <motion.div variants={itemVariants} className="mt-6 flex gap-3">
            <Link to="/dashboard" className="btn-secondary flex-1 text-center">
              Dashboard
            </Link>
            <Link to="/settings" className="btn-secondary flex-1 text-center">
              <Settings size={18} /> Settings
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;