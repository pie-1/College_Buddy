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
    <div className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:border-primary-500">
      <AnimatePresence>
        {value.map((tag) => (
          <motion.span
            key={tag}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-primary-200 rounded-full p-0.5 transition"
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
          placeholder={value.length === 0 ? 'Type a tag and press Enter' : 'Add tag...'}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
        />
      )}
    </div>
  );
};

export default TagInput;