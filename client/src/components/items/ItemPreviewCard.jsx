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
    <motion.div layout className="overflow-hidden rounded-3xl border border-primary-100 bg-white p-5 shadow-xl shadow-primary-900/5 dark:border-slate-700 dark:bg-slate-900">
      <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl bg-primary-100 dark:bg-slate-800">
        {firstImage ? (
          <img src={firstImage} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-primary-700 dark:text-primary-300">
            <Package size={40} aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-wider">Photo preview</span>
          </div>
        )}

        {data.category && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-primary-800 shadow-sm backdrop-blur">
            {categoryLabels[data.category] || data.category}
          </span>
        )}

        {data.condition && (
          <span className="absolute right-3 top-3 rounded-full bg-primary-800 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            {conditionLabels[data.condition] || data.condition}
          </span>
        )}
      </div>

      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 font-bold text-slate-950 dark:text-white">
          {data.title || 'Your title will appear here'}
        </h3>
        <span className="whitespace-nowrap font-extrabold text-primary-800 dark:text-primary-200">
          {data.price > 0 ? `Rs ${data.price}` : 'Free'}
        </span>
      </div>

      <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {data.description || 'Your description will appear here as you type.'}
      </p>

      {data.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {data.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">
        <span className="flex items-center gap-1.5">
          <User size={14} aria-hidden="true" />
          {ownerName}
        </span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
          Available
        </span>
      </div>
    </motion.div>
  );
};

export default ItemPreviewCard;