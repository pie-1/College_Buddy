import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Type,
  AlignLeft,
  Building,
  MapPin,
  Tag,
  DollarSign,
  X,
  ArrowLeft,
  Upload,
  Gift,
  ShoppingCart,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const DEPARTMENTS = [
  { value: 'computer', label: '💻 Computer Science' },
  { value: 'civil', label: '🏗️ Civil Engineering' },
  { value: 'architecture', label: '🏛️ Architecture' },
  { value: 'common', label: '📚 Common' },
];

const LISTING_TYPES = [
  { value: 'free', label: 'Share for Free', icon: Gift },
  { value: 'sell', label: 'Sell', icon: ShoppingCart },
  { value: 'rent', label: 'Rent', icon: Clock },
];

const CreatePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      department: '',
      location: '',
      listingType: 'free',
      price: '',
      available: true,
      tags: [],
    },
  });

  const listingType = watch('listingType');
  const tags = watch('tags');

  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const validator = {
    title: {
      required: 'Title is required',
      minLength: { value: 3, message: 'Title must have at least 3 characters' },
    },
    description: {
      required: 'Description is required',
      minLength: { value: 10, message: 'Description must have at least 10 characters' },
    },
    department: {
      required: 'Please select a department',
    },
    location: {
      required: 'Pickup location is required',
    },
    price: {
      validate: (value) => {
        if (listingType === 'free') return true;
        if (!value) return 'Price is required';
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          return 'Enter a valid price (e.g. 100 or 100.50)';
        }
        return true;
      },
    },
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag) && tags.length < 6) {
        setValue('tags', [...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setValue('tags', tags.filter((t) => t !== tagToRemove));
  };

  const onSubmit = async (data) => {
    try {
      const payload = new FormData();
      payload.append('title', data.title.trim());
      payload.append('description', data.description.trim());
      payload.append('department', data.department);
      payload.append('location', data.location.trim());
      payload.append('listingType', data.listingType);
      payload.append('available', data.available);
      payload.append('tags', JSON.stringify(data.tags));
      if (data.listingType !== 'free') {
        payload.append('price', parseFloat(data.price));
      }
      if (imageFile) payload.append('image', imageFile);

      // Replace with your real API call, e.g.:
      // const res = await api.post('/items', payload, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // });
      // if (res.status !== 201) throw new Error(res.response?.data?.error || 'Failed to create item');
      await new Promise((resolve) => setTimeout(resolve, 800));

      reset();
      removeImage();
      toast.success('Item shared with your community! 🎉');
      navigate('/catalogue');
    } catch (err) {
      toast.error(err.message || 'Failed to share item. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline mb-6"
        >
          <ArrowLeft size={16} />
          Back to Catalogue
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary-200/30">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary-800 font-display">
              Share an Item
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Give your item a second life within your college community
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Listing Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Listing Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {LISTING_TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue('listingType', value)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-sm font-medium transition ${
                      listingType === value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-500 hover:border-primary-200'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Photo (optional)
              </label>
              {imagePreview ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-primary-200 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition">
                  <Upload className="text-primary-400 mb-2" size={28} />
                  <span className="text-sm text-gray-500">
                    Click to upload an image
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG or JPG, up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  {...register('title', validator.title)}
                  placeholder="e.g. Data Structures Textbook"
                  maxLength={80}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition ${
                    errors.title ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-primary-500'
                  }`}
                />
              </div>
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  {...register('description', validator.description)}
                  rows={4}
                  placeholder="What is it, what condition is it in, anything a borrower should know?"
                  maxLength={500}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition resize-none ${
                    errors.description ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-primary-500'
                  }`}
                />
              </div>
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Department
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  {...register('department', validator.department)}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition appearance-none ${
                    errors.department ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-primary-500'
                  }`}
                >
                  <option value="">Select a department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.department && (
                <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>
              )}
            </div>

            {/* Price - only for sell/rent */}
            {listingType !== 'free' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price (Rs.) {listingType === 'rent' ? '- per day' : ''}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('price', validator.price)}
                    placeholder={listingType === 'rent' ? 'Daily rental price' : 'Selling price'}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition ${
                      errors.price ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-primary-500'
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
                )}
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pickup Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  {...register('location', validator.location)}
                  placeholder="e.g. Library, 2nd Floor"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition ${
                    errors.location ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-primary-500'
                  }`}
                />
              </div>
              {errors.location && (
                <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tags <span className="text-gray-400 font-normal">(up to 6, press Enter to add)</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  disabled={tags.length >= 6}
                  placeholder="e.g. textbook, dsa"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition disabled:opacity-50"
                />
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-primary-900"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Availability */}
            <label className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 cursor-pointer">
              <input
                type="checkbox"
                {...register('available')}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500/30"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Available right now
                </p>
                <p className="text-xs text-gray-400">
                  Uncheck if it's currently lent out — you can change this later
                </p>
              </div>
            </label>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Sharing...' : 'Share Item'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePage;
