// client/src/pages/Roommates.jsx
import { useState, useEffect } from 'react';
import api from '../api/client';
import Loader from '../components/common/Loader';
import { MapPin, DollarSign, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Roommates = () => {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/roommates').then(res => {
      setRoommates(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container-custom section-padding">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-primary-800 mb-2">Find a Roommate</h1>
        <p className="text-primary-500 mb-8">Connect with students looking for shared flats.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roommates.map(user => (
            <div key={user._id} className="card flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-primary-800">{user.name}</h3>
                  <p className="text-sm text-primary-500">{user.dept} • Year {user.year}</p>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {user.roommateDetails?.budget && (
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <DollarSign size={16} className="text-success" /> NPR {user.roommateDetails.budget}/mo
                  </div>
                )}
                {user.roommateDetails?.preferredLocation && (
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <MapPin size={16} className="text-info" /> {user.roommateDetails.preferredLocation}
                  </div>
                )}
              </div>

              <Link to={`/profile/${user._id}`} className="btn-secondary text-sm w-full text-center">
                <MessageCircle size={16} /> View Profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Roommates;