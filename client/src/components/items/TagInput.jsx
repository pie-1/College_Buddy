import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const TagInput = ({ value = [], onChange, maxTags = 5 }) => {
  const [input, setInput] = useState('');

  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase();
    if (!tag) return;
    if (value.includes(tag)) {
      setInput('');
      return;
    }
    if (value.length >= maxTags) return;
    onChange([...value, tag]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border border-slate-300 bg-white p-2 shadow-sm transition focus-within:border-primary-600 focus-within:ring-4 focus-within:ring-primary-500/15 dark:border-slate-600 dark:bg-slate-900">
      <AnimatePresence>
        {value.map((tag) => (
          <motion.span
            key={tag}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-bold text-primary-800 dark:bg-primary-900 dark:text-primary-100"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag} tag`}
              className="rounded-full p-0.5 transition hover:bg-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:hover:bg-primary-700"
            >
              <X size={12} />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      {value.length < maxTags && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Add a tag"
          placeholder={value.length === 0 ? 'Type a tag and press Enter' : 'Add tag...'}
          className="min-w-[120px] flex-1 bg-transparent px-2 py-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400"
        />
      )}
    </div>
  );
};

export default TagInput;