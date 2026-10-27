import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Tag,
  Calendar,
  Package,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [renting, setRenting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        setItem(data);
      } catch (error) {
        console.error('Error fetching item:', error);
        toast.error('Item not found');
        navigate('/catalogue');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);

  const handleRent = async () => {
    if (!user) {
      toast.error('Please log in to rent this item');
      return navigate('/login');
    }

    setRenting(true);
    try {
      await api.post(`/items/${id}/rent`);
      toast.success('Item rented successfully!');
      // Update local state to show it's no longer available
      setItem((prev) => ({ ...prev, status: 'borrowed' }));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to rent item');
    } finally {
      setRenting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-primary-50 via-white to-indigo-50/70 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/30">
        <div
          role="status"
          aria-label="Loading item details"
          className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"
        />
      </div>
    );
  }

  if (!item) return null;

  // Determine if the current user is the owner
  const isOwner = user && item.owner?._id === user.id;
  const isAvailable = item.status === 'available';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50/70 py-10 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/30 sm:py-14">
      <div className="container-custom">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-x-0.5 hover:border-primary-300 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-white"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to catalogue
        </button>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.section
            aria-label="Item photos"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-xl shadow-primary-900/5 dark:border-slate-700 dark:bg-slate-900">
              {item.images?.[activeImage] ? (
                <img
                  src={item.images[activeImage]}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-primary-300">
                  <Package size={64} aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-[0.15em]">No photo available</span>
                </div>
              )}
              <span
                className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold shadow-md ${
                  isAvailable
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/80 dark:text-emerald-100'
                    : 'bg-slate-900/85 text-white'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-emerald-600 dark:bg-emerald-300' : 'bg-slate-300'}`} />
                {isAvailable ? 'Available' : 'Not available'}
              </span>
            </div>

            {item.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1" aria-label="Choose a photo">
                {item.images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    aria-label={`View photo ${idx + 1}`}
                    aria-pressed={activeImage === idx}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/25 ${
                      activeImage === idx
                        ? 'border-primary-700 shadow-md'
                        : 'border-white opacity-75 hover:border-primary-300 hover:opacity-100 dark:border-slate-700'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.section>

          <motion.section
            aria-labelledby="item-title"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl border border-primary-100 bg-white p-5 shadow-xl shadow-primary-900/5 dark:border-slate-700 dark:bg-slate-900 sm:p-8"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary-800 dark:border-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
              <Sparkles size={14} aria-hidden="true" />
              Campus listing
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-800 dark:bg-primary-900 dark:text-primary-100">
                {item.category}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                {item.condition}
              </span>
            </div>

            <h1 id="item-title" className="mb-3 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {item.title}
            </h1>

            <div className="mb-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-3xl font-extrabold text-primary-800 dark:text-primary-200">
                {item.price > 0 ? `Rs ${item.price}` : 'Free'}
              </span>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                / {item.price > 0 ? 'sale' : 'borrow'}
              </span>
            </div>

            <div className="border-t border-slate-200 py-5 dark:border-slate-700">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-slate-100">About this item</h2>
              <p className="whitespace-pre-line text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {item.description}
              </p>
            </div>

            {item.tags?.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <Tag size={16} className="text-primary-700 dark:text-primary-300" aria-hidden="true" />
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-700 text-lg font-extrabold text-white shadow-md shadow-primary-900/15">
                  {item.owner?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-950 dark:text-white">{item.owner?.name || 'Unknown User'}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <MapPin size={13} aria-hidden="true" />
                    {item.owner?.dept || 'Campus'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Calendar size={14} aria-hidden="true" />
                <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-5 dark:border-slate-700">
              {isOwner ? (
                <div className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-center text-sm font-semibold text-primary-900 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-100">
                  This is your listing. You cannot rent your own item.
                </div>
              ) : (
                <Button
                  onClick={handleRent}
                  disabled={!isAvailable || renting}
                  className="w-full py-4 text-base font-bold shadow-lg shadow-primary-700/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-primary-500/30 active:translate-y-0 disabled:shadow-none"
                >
                  {renting ? 'Processing...' : !isAvailable ? 'Currently unavailable' : (
                    <>
                      Rent / Buy now
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </>
                  )}
                </Button>
              )}
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <CheckCircle size={14} className="text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                Safe campus hand-off
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;