import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft, Upload } from 'lucide-react';

const AddItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'BOOKS',
    condition: 'GOOD',
    listingType: 'borrow',
    price: '',
    tags: '',
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 3) {
      toast.error('You can only upload a maximum of 3 files');
      return;
    }

    const hasLargeFile = files.some(file => file.size > 5 * 1024 * 1024);
    if (hasLargeFile) {
      toast.error('Each file must be less than 5MB');
      return;
    }

    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('condition', formData.condition);
      data.append('listingType', formData.listingType);
      
      if (formData.listingType === 'sell' && formData.price) {
        data.append('price', formData.price);
      }
      
      if (formData.tags) {
        data.append('tags', formData.tags);
      }

      images.forEach((image) => {
        data.append('images', image);
      });

      await api.post('/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Item listed successfully!');
      navigate('/my-listings');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
          <ArrowLeft size={20} /> Back
        </button>
        
        <div className="bg-[#1a1b26] border border-gray-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-6">Share an Item</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                name="title"
                required
                minLength={3}
                maxLength={80}
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Engineering Mathematics Textbook"
                className="w-full bg-[#252636] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                required
                minLength={10}
                maxLength={500}
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item, its condition, etc."
                className="w-full bg-[#252636] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-[#252636] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6c5ce7]"
                >
                  <option value="BOOKS">Books</option>
                  <option value="TOOLS">Tools</option>
                  <option value="NOTES">Notes</option>
                  <option value="GAMES">Games</option>
                  <option value="ELECTRONICS">Electronics</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full bg-[#252636] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6c5ce7]"
                >
                  <option value="NEW">New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="WORN">Worn</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Listing Type</label>
                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  className="w-full bg-[#252636] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6c5ce7]"
                >
                  <option value="borrow">Borrow (Free)</option>
                  <option value="sell">Sell</option>
                </select>
              </div>

              {formData.listingType === 'sell' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (Rs.)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    className="w-full bg-[#252636] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6c5ce7]"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., math, textbook, 3rd-sem"
                className="w-full bg-[#252636] border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Images or PDF (Max 3)</label>
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-[#6c5ce7] transition cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-gray-500 mb-2" size={24} />
                <p className="text-sm text-gray-400">Click to upload images or PDF</p>
                <p className="text-xs text-gray-500 mt-1">{images.length} files selected</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6c5ce7] hover:bg-[#5a4bcf] text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem;