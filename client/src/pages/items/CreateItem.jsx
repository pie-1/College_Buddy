import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { createItem } from '../../api/items.api';
import ImageDropzone from '../../components/items/ImageDropzone';
import TagInput from '../../components/items/TagInput';
import ItemPreviewCard from '../../components/items/ItemPreviewCard';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'BOOKS', label: 'Books', emoji: '📚' },
  { value: 'TOOLS', label: 'Tools', emoji: '🔧' },
  { value: 'NOTES', label: 'Notes', emoji: '📝' },
  { value: 'GAMES', label: 'Games', emoji: '🎮' },
  { value: 'ELECTRONICS', label: 'Electronics', emoji: '📱' },
  { value: 'OTHER', label: 'Other', emoji: '📦' },
];

const CONDITIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'WORN', label: 'Worn' },
];

const schema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(1000),
  category: z.enum(['BOOKS', 'TOOLS', 'NOTES', 'GAMES', 'ELECTRONICS', 'OTHER'], {
    message: 'Please select a category',
  }),
  condition: z.enum(['NEW', 'GOOD', 'FAIR', 'WORN'], {
    message: 'Please select a condition',
  }),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags').default([]),
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CreateItem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      condition: '',
      tags: [],
    },
  });

  const watchedValues = watch();

  // Warn on refresh mid-form
  useEffect(() => {
    const handler = (e) => {
      if (isDirty && !submitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty, submitting]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('condition', data.condition);
      formData.append('tags', data.tags.join(','));
      images.forEach((img) => formData.append('images', img.file));

      const res = await createItem(formData);
      toast.success('Item created!');
      navigate('/catalogue');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to create item');
      setSubmitting(false);
    }
  };

  return (
    <div className="container-custom section-padding">
      <h1 className="font-display text-3xl font-bold text-primary-800 mb-6">
        Create a Listing
      </h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
      >
        {/* Form (left, 3/5) */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-3 space-y-5 card"
        >
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title
            </label>
            <input
              {...register('title')}
              placeholder="e.g., Data Structures Textbook"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="What are you sharing? Mention any details..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setValue('category', cat.value, { shouldValidate: true, shouldDirty: true })}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition ${
                    watchedValues.category === cat.value
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition
            </label>
            <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setValue('condition', c.value, { shouldValidate: true, shouldDirty: true })}
                  className={`flex-1 py-2.5 text-sm font-medium transition ${
                    watchedValues.condition === c.value
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {errors.condition && (
              <p className="text-xs text-red-600 mt-1">{errors.condition.message}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tags (optional)
            </label>
            <TagInput
              value={watchedValues.tags}
              onChange={(tags) => setValue('tags', tags, { shouldDirty: true })}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Images (optional, max 3)
            </label>
            <ImageDropzone files={images} onChange={setImages} />
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating listing...
              </span>
            ) : (
              'Publish Listing'
            )}
          </motion.button>
        </form>

        {/* Preview (right, 2/5) */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <p className="text-sm font-medium text-gray-600 mb-2">Live Preview</p>
          <ItemPreviewCard
            data={watchedValues}
            images={images}
            ownerName={user?.name || 'You'}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateItem;