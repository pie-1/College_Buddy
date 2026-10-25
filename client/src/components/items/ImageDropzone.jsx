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
        className={`block w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 bg-gray-50'
        } ${files.length >= MAX_IMAGES ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <Upload className="mx-auto mb-2 text-gray-400" size={24} />
        <p className="text-sm text-gray-600">
          {files.length >= MAX_IMAGES
            ? 'Maximum 3 images reached'
            : 'Drag & drop or click to upload'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {files.length}/{MAX_IMAGES} images • JPG, PNG, WEBP (max 5MB each)
        </p>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
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
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={f.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(f.id)}
                  className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black/80 transition"
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