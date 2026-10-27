import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
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
  price: z.coerce.number().min(0, 'Price cannot be negative').default(0), // NEW
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

const inputClasses =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-500 hover:border-primary-400 focus:border-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500/15 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:border-primary-400';

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
      price: 0, // NEW
      tags: [],
    },
  });

  const watchedValues = watch();

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
      formData.append('price', data.price); // NEW
      formData.append('tags', data.tags.join(','));
      images.forEach((img) => formData.append('images', img.file));

      const res = await createItem(formData);
      toast.success('Item created!');
      navigate(`/items/${res.item._id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to create item');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50/70 py-12 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/30 sm:py-16">
      <div className="container-custom">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 max-w-2xl"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary-700 shadow-sm dark:border-primary-700 dark:bg-slate-900 dark:text-primary-200">
            <Sparkles size={14} aria-hidden="true" />
            Share with your campus
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Create a listing
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
            Give useful things a second life. Add a few details and students can find your listing.
          </p>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5 lg:gap-8"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-3xl border border-primary-100 bg-white p-5 shadow-xl shadow-primary-900/5 dark:border-slate-700 dark:bg-slate-900 sm:p-8 lg:col-span-3"
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="item-title" className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-slate-100">Title</label>
              <input
                id="item-title"
                {...register('title')}
                placeholder="e.g., Data Structures Textbook"
                className={inputClasses}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && <p id="title-error" role="alert" className="mt-1.5 text-sm font-medium text-red-700 dark:text-red-300">{errors.title.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="item-description" className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-slate-100">Description</label>
              <textarea
                id="item-description"
                {...register('description')}
                rows={4}
                placeholder="What are you sharing? Mention any useful details..."
                className={`${inputClasses} resize-y`}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              {errors.description && <p id="description-error" role="alert" className="mt-1.5 text-sm font-medium text-red-700 dark:text-red-300">{errors.description.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="item-price" className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-slate-100">Price <span className="font-medium text-slate-600 dark:text-slate-400">(Rs)</span></label>
              <input
                id="item-price"
                type="number"
                min="0"
                step="1"
                {...register('price')}
                placeholder="0 for free or borrow"
                className={inputClasses}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={errors.price ? 'price-error' : 'price-hint'}
              />
              <p id="price-hint" className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">Leave at 0 if you’re giving it away or lending it.</p>
              {errors.price && <p id="price-error" role="alert" className="mt-1.5 text-sm font-medium text-red-700 dark:text-red-300">{errors.price.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <p id="category-label" className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100">Category</p>
              <div role="group" aria-labelledby="category-label" className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    aria-pressed={watchedValues.category === cat.value}
                    onClick={() => setValue('category', cat.value, { shouldValidate: true, shouldDirty: true })}
                    className={`rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/25 active:translate-y-0 ${
                      watchedValues.category === cat.value
                        ? 'border-primary-700 bg-primary-700 text-white shadow-md shadow-primary-700/20'
                        : 'border-slate-300 bg-slate-50 text-slate-800 hover:border-primary-500 hover:bg-primary-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span aria-hidden="true">{cat.emoji}</span> {cat.label}
                  </button>
                ))}
              </div>
              {errors.category && <p role="alert" className="mt-1.5 text-sm font-medium text-red-700 dark:text-red-300">{errors.category.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <p id="condition-label" className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100">Condition</p>
              <div role="group" aria-labelledby="condition-label" className="grid grid-cols-2 gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 p-1.5 dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-4">
                {CONDITIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    aria-pressed={watchedValues.condition === c.value}
                    onClick={() => setValue('condition', c.value, { shouldValidate: true, shouldDirty: true })}
                    className={`rounded-xl px-3 py-2.5 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/25 ${
                      watchedValues.condition === c.value
                        ? 'bg-primary-700 text-white shadow-md'
                        : 'text-slate-700 hover:bg-white hover:text-primary-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              {errors.condition && <p role="alert" className="mt-1.5 text-sm font-medium text-red-700 dark:text-red-300">{errors.condition.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-slate-100">Tags <span className="font-medium text-slate-600 dark:text-slate-400">(optional, up to 5)</span></label>
              <TagInput
                value={watchedValues.tags}
                onChange={(tags) => setValue('tags', tags, { shouldDirty: true })}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="mb-1.5 block text-sm font-bold text-slate-900 dark:text-slate-100">Photos <span className="font-medium text-slate-600 dark:text-slate-400">(optional, up to 3)</span></p>
              <ImageDropzone files={images} onChange={setImages} />
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={submitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-primary-700/20 transition duration-200 hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-xl hover:shadow-primary-800/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating listing...
                </>
              ) : (
                <>
                  Publish listing
                  <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </>
              )}
            </motion.button>
          </form>

          <motion.aside variants={itemVariants} className="lg:sticky lg:top-24 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">Live preview</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">This is how your listing will look.</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">Preview</span>
            </div>
            <ItemPreviewCard
              data={watchedValues}
              images={images}
              ownerName={user?.name || 'You'}
            />
          </motion.aside>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateItem;