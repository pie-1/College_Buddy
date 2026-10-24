import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile, updateMyProfile } from '../api/user.api';
import { 
  Mail, MapPin, Calendar, Edit, Check, X, Loader, Building
} from 'lucide-react';

const Profile = () => {
  const { userId } = useParams(); // Could be undefined if viewing own profile
  const { user: currentUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    dept: '',
    year: '',
    hostel: '',
  });

  const isOwnProfile = !userId || (currentUser && userId === currentUser._id);

  // Fetch real data on load
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile(userId);
        setProfileUser(data);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          dept: data.dept || '',
          year: data.year || '',
          hostel: data.hostel || '',
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedUser = await updateMyProfile(formData);
      setProfileUser({ ...profileUser, ...updatedUser });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20"><Loader className="animate-spin mx-auto text-primary-500" size={40} /></div>;
  }

  if (!profileUser) {
    return <div className="text-center py-20 text-primary-500">User not found</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-custom section-padding">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Card */}
        <div className="card text-center relative bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
          {isOwnProfile && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition">
              <Edit size={20} />
            </button>
          )}

          <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-4xl text-white font-bold bg-gradient-to-r from-primary-500 to-secondary-500 shadow-md">
            {profileUser.name?.charAt(0).toUpperCase()}
          </div>

          <h2 className="text-3xl font-bold mt-4 text-gray-800 dark:text-white">{profileUser.name}</h2>
          
          <div className="flex items-center justify-center gap-2 mt-2 text-gray-600 dark:text-gray-300">
            <Building size={16} />
            <span>{profileUser.dept}</span>
            <span>•</span>
            <span>Year {profileUser.year}</span>
          </div>

          {profileUser.bio && (
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-lg mx-auto">{profileUser.bio}</p>
          )}
        </div>

        {/* Edit Form */}
        {isEditing && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card mt-6 bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Hostel</label>
                  <input type="text" name="hostel" value={formData.hostel} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Department</label>
                  <select name="dept" value={formData.dept} onChange={handleChange} className="w-full p-2 border rounded-lg">
                    <option value="COMPUTER">Computer</option>
                    <option value="BIT">BIT</option>
                    <option value="CIVIL">Civil</option>
                    <option value="ARCHI">Architecture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Year</label>
                  <select name="year" value={formData.year} onChange={handleChange} className="w-full p-2 border rounded-lg">
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full p-2 border rounded-lg" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg">
                  {saving ? <Loader size={18} className="animate-spin" /> : <Check size={18} />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Contact Info */}
        <div className="card mt-6 bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center gap-3"><Mail size={18} /> {profileUser.email}</div>
            {profileUser.hostel && <div className="flex items-center gap-3"><MapPin size={18} /> {profileUser.hostel}</div>}
            <div className="flex items-center gap-3"><Calendar size={18} /> Joined {new Date(profileUser.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Profile;