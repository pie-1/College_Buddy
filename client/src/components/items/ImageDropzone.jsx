import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X } from 'lucide-react';

const MAX_IMAGES = 3;

const ImageDropzone = ({ files = [], onChange }) => {
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback(
    (newFiles) => {
      const remaining = MAX_IMAGES - files.length;
      if (remaining <= 0) return;
      const valid = Array.from(newFiles)
        .filter((f) => f.type.startsWith('image/'))
        .slice(0, remaining)
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          id: `${file.name}-${file.lastModified}-${Math.random()}`,
        }));
      onChange([...files, ...valid]);
    },
    [files, onChange]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    addFiles(e.target.files);
    e.target.value = ''; // reset so same file can be re-selected
  };

  const removeImage = (id) => {
    const target = files.find((f) => f.id === id);
    if (target?.preview) URL.revokeObjectURL(target.preview);
    onChange(files.filter((f) => f.id !== id));
  };

  return (
    <div>
      <label
        htmlFor="image-upload"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`block w-full cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition duration-200 focus-within:outline-none focus-within:ring-4 focus-within:ring-primary-500/20 ${
          dragOver
            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30'
            : 'border-slate-300 bg-slate-50 hover:border-primary-500 hover:bg-primary-50/70 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700'
        } ${files.length >= MAX_IMAGES ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <Upload className="mx-auto mb-2 text-primary-700 dark:text-primary-300" size={24} />
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {files.length >= MAX_IMAGES
            ? 'Maximum 3 images reached'
            : 'Drag and drop, or click to upload'}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          {files.length}/{MAX_IMAGES} images • JPG, PNG, WEBP (max 5MB each)
        </p>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="sr-only"
        />
      </label>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          <AnimatePresence>
            {files.map((f) => (
              <motion.div
                key={f.id}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
              >
                <img
                  src={f.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(f.id)}
                  aria-label="Remove image"
                  className="absolute right-2 top-2 rounded-full bg-slate-950/80 p-1.5 text-white shadow transition hover:scale-110 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;