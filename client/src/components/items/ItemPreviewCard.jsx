import { motion } from 'framer-motion';
import { User, Package } from 'lucide-react';

const conditionLabels = {
  NEW: 'New',
  GOOD: 'Good',
  FAIR: 'Fair',
  WORN: 'Worn',
};

const categoryLabels = {
  BOOKS: 'Books',
  TOOLS: 'Tools',
  NOTES: 'Notes',
  GAMES: 'Games',
  ELECTRONICS: 'Electronics',
  OTHER: 'Other',
};

const ItemPreviewCard = ({ data, images = [], ownerName = 'You' }) => {
  const firstImage = images[0]?.preview;

  return (
    <motion.div
      layout
      className="card bg-white sticky top-24"
    >
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-video bg-primary-100">
        {firstImage ? (
          <img
            src={firstImage}
            alt={data.title || 'Preview'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-primary-300">
            <Package size={40} />
          </div>
        )}

        {data.category && (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur text-primary-700">
            {categoryLabels[data.category] || data.category}
          </span>
        )}

        {data.condition && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-600 text-white">
            {conditionLabels[data.condition] || data.condition}
          </span>
        )}

        {images.length > 1 && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white">
            +{images.length - 1}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-primary-800 line-clamp-1">
        {data.title || 'Your title will appear here'}
      </h3>

      <p className="text-sm text-primary-500 mt-1 line-clamp-2 min-h-[2.5rem]">
        {data.description || 'Your description will appear here as you type.'}
      </p>

      {data.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-primary-100 flex items-center justify-between text-xs text-primary-500">
        <span className="flex items-center gap-1">
          <User size={14} />
          {ownerName}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
          Available
        </span>
      </div>
    </motion.div>
  );
};

export default ItemPreviewCard;