import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile, updateMyProfile } from '../api/user.api';
import TagInput from '../components/profile/TagInput';
import { Mail, MapPin, Calendar, Edit, Check, X, Loader, Building, Sparkles, Home, DollarSign } from 'lucide-react';

const Profile = () => {
  const { userId } = useParams(); 
  const { user: currentUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  
  // Removed 'hostel', added roommate fields
  const [formData, setFormData] = useState({
    name: '', 
    bio: '', 
    dept: '', 
    year: '', 
    skills: [], 
    interests: [],
    lookingForRoommate: false,
    roommateBudget: '',
    roommateLocation: ''
  });

  const isOwnProfile = !userId || (currentUser && userId === currentUser._id);

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
          skills: data.skills || [],
          interests: data.interests || [],
          lookingForRoommate: data.lookingForRoommate || false,
          roommateBudget: data.roommateDetails?.budget || '',
          roommateLocation: data.roommateDetails?.preferredLocation || ''
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Format data for backend
      const payload = {
        name: formData.name,
        bio: formData.bio,
        dept: formData.dept,
        year: formData.year,
        skills: formData.skills,
        interests: formData.interests,
        lookingForRoommate: formData.lookingForRoommate,
        roommateDetails: {
          budget: formData.roommateBudget ? Number(formData.roommateBudget) : undefined,
          preferredLocation: formData.roommateLocation
        }
      };

      const updatedUser = await updateMyProfile(payload);
      setProfileUser({ ...profileUser, ...updatedUser });
      setIsEditing(false);
    } catch (error) {
      alert("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20"><Loader className="animate-spin mx-auto text-primary-500" size={40} /></div>;
  if (!profileUser) return <div className="text-center py-20">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-primary-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Header Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-primary-800 rounded-3xl shadow-xl overflow-hidden border border-primary-100 dark:border-primary-700">
          <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
          
          <div className="px-8 pb-8 relative">
            <div className="flex justify-between items-end -mt-12 mb-4">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-primary-900 p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 text-3xl font-bold">
                  {profileUser.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              {isOwnProfile && !isEditing && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl font-medium hover:bg-primary-100 transition">
                  <Edit size={16} /> Edit Profile
                </button>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profileUser.name}</h2>
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
              <Building size={16} /> {profileUser.dept} • Year {profileUser.year}
            </div>
            
            <p className="mt-4 text-gray-600 dark:text-gray-300">{profileUser.bio || "No bio added yet."}</p>

            {/* Skills & Interests */}
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-500"/> Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profileUser.skills?.length > 0 ? profileUser.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">{skill}</span>
                  )) : <span className="text-sm text-gray-400">No skills added.</span>}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {profileUser.interests?.length > 0 ? profileUser.interests.map(interest => (
                    <span key={interest} className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">{interest}</span>
                  )) : <span className="text-sm text-gray-400">No interests added.</span>}
                </div>
              </div>
            </div>

            {/* Roommate Status Badge */}
            {profileUser.lookingForRoommate && (
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-xl flex items-center gap-3">
                <Home className="text-orange-500" size={20} />
                <div>
                  <p className="font-semibold text-orange-800 dark:text-orange-300">Looking for a Roommate</p>
                  {profileUser.roommateDetails?.budget && (
                    <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      <DollarSign size={14} /> Budget: NPR {profileUser.roommateDetails.budget}/mo
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Edit Form */}
        {isEditing && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-white dark:bg-primary-800 p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Full Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-primary-900 border border-gray-200 dark:border-primary-700 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Department</label>
                  <select value={formData.dept} onChange={(e) => setFormData({...formData, dept: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-primary-900 border border-gray-200 dark:border-primary-700 rounded-xl">
                    <option value="COMPUTER">Computer</option>
                    <option value="BIT">BIT</option>
                    <option value="CIVIL">Civil</option>
                    <option value="ARCHI">Architecture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Bio</label>
                <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows="3" className="w-full p-3 bg-gray-50 dark:bg-primary-900 border border-gray-200 dark:border-primary-700 rounded-xl" placeholder="Tell us about yourself..." />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Skills (Press Enter to add)</label>
                <TagInput tags={formData.skills} setTags={(tags) => setFormData({...formData, skills: tags})} placeholder="e.g. React, Python..." />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Interests (Press Enter to add)</label>
                <TagInput tags={formData.interests} setTags={(tags) => setFormData({...formData, interests: tags})} placeholder="e.g. AI, Basketball..." />
              </div>

              {/* Roommate Finder Toggle inside Profile */}
              <div className="p-4 bg-gray-50 dark:bg-primary-900 border border-gray-200 dark:border-primary-700 rounded-xl space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.lookingForRoommate} 
                    onChange={(e) => setFormData({...formData, lookingForRoommate: e.target.checked})}
                    className="w-5 h-5 text-primary-600 rounded"
                  />
                  <span className="font-medium text-gray-800 dark:text-gray-200">Looking for a Roommate?</span>
                </label>

                {formData.lookingForRoommate && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-500">Budget (NPR/mo)</label>
                      <input type="number" value={formData.roommateBudget} onChange={(e) => setFormData({...formData, roommateBudget: e.target.value})} className="w-full p-2 bg-white dark:bg-primary-800 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-500">Preferred Location</label>
                      <input type="text" value={formData.roommateLocation} onChange={(e) => setFormData({...formData, roommateLocation: e.target.value})} className="w-full p-2 bg-white dark:bg-primary-800 border rounded-lg" placeholder="Near campus..." />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-primary-700">
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition">
                  {saving ? <Loader size={18} className="animate-spin" /> : <Check size={18} />} Save Changes
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-gray-100 dark:bg-primary-700 rounded-xl font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Profile;