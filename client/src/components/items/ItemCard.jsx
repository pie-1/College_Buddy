/**
  Item Card Component
  Added image placeholder
  Added availability status
  Added click handler
 */

import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock, User } from 'lucide-react';

const ItemCard = ({
  id,
  title,
  description,
  image,
  department,
  owner,
  location,
  available = true,
  createdAt,
  category,
  onLike,
  isLiked = false,
  className = '',
}) => {
  const departmentColors = {
    computer: 'dept-computer',
    civil: 'dept-civil',
    architecture: 'dept-architecture',
    common: 'dept-common',
  };

  const deptColor = departmentColors[department?.toLowerCase()] || 'dept-common';

  return (
    <div className={`card group ${className}`}>
      {/* Image */}
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-video bg-primary-100 dark:bg-primary-800/30">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-primary-300 dark:text-primary-600">
            📦
          </div>
        )}
        
        {/* Like Button */}
        <button
          onClick={onLike}
          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-primary-900/80 backdrop-blur rounded-full hover:bg-white dark:hover:bg-primary-800 transition shadow-sm"
        >
          <Heart
            size={18}
            className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}
          />
        </button>

        {/* Department Badge */}
        <span className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-primary-900/90 backdrop-blur ${deptColor}`}>
          {department || 'General'}
        </span>
      </div>

      {/* Content */}
      <Link to={`/items/${id}`}>
        <h3 className="font-semibold text-primary-800 dark:text-primary-100 hover:text-primary-600 dark:hover:text-primary-400 transition line-clamp-1">
          {title}
        </h3>
      </Link>
      
      <p className="text-sm text-primary-500 dark:text-primary-400 mt-1 line-clamp-2">
        {description}
      </p>

      {/* Metadata */}
      <div className="mt-3 pt-3 border-t border-primary-100 dark:border-primary-800/50 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-primary-500 dark:text-primary-400">
          <span className="flex items-center gap-1">
            <User size={14} />
            {owner || 'Anonymous'}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {location || 'On Campus'}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-primary-400 dark:text-primary-500">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {createdAt ? new Date(createdAt).toLocaleDateString() : 'Recently'}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            available 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            {available ? 'Available' : 'Not Available'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;