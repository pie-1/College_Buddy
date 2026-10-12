import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { User, Mail, GraduationCap, Building, BookOpen, ArrowLeft } from 'lucide-react';

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please log in</h1>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"
          >
            <ArrowLeft size={18} />
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-8 text-center">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-24 h-24 rounded-full mx-auto border-4 border-white object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white text-primary-600 text-3xl font-bold flex items-center justify-center mx-auto">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <h1 className="text-2xl font-bold text-white mt-4">{user.name}</h1>
            <p className="text-white/80 text-sm">{user.email}</p>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <User className="text-primary-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-800">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Mail className="text-primary-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Building className="text-primary-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Faculty</p>
                  <p className="font-medium text-gray-800">{user.faculty || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <GraduationCap className="text-primary-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Semester</p>
                  <p className="font-medium text-gray-800">{user.semester || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{user.totalBorrows || 0}</p>
                <p className="text-xs text-gray-500">Borrows</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{user.totalLends || 0}</p>
                <p className="text-xs text-gray-500">Lends</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{user.reputation || 0}</p>
                <p className="text-xs text-gray-500">Reputation</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Link
                to="/dashboard"
                className="flex-1 text-center py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/catalogue"
                className="flex-1 text-center py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;