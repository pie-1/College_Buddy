import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { ArrowLeft, Loader2, Package } from 'lucide-react';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0b0c10] flex justify-center items-center"><Loader2 className="animate-spin text-[#6c5ce7]" size={40} /></div>;
  if (!item) return <div className="min-h-screen bg-[#0b0c10] text-white flex justify-center items-center">Item not found</div>;

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft size={20} /> Back
        </button>
        
        <div className="bg-[#1a1b26] border border-gray-800 rounded-2xl overflow-hidden grid md:grid-cols-2">
          <div className="bg-[#252636] aspect-square flex items-center justify-center p-8">
            {item.images && item.images.length > 0 ? (
              <img src={item.images[0]} alt={item.title} className="w-full h-full object-contain rounded-xl" />
            ) : (
              <Package size={80} className="text-gray-600" />
            )}
          </div>
          
          <div className="p-8">
            <span className="text-[#6c5ce7] font-bold uppercase text-sm">{item.category}</span>
            <h1 className="text-3xl font-bold mt-2 mb-4">{item.title}</h1>
            <p className="text-gray-400 mb-6">{item.description}</p>
            
            <div className="space-y-4 border-t border-gray-800 pt-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Condition</span>
                <span className="font-medium">{item.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium capitalize">{item.listingType}</span>
              </div>
              {item.listingType === 'sell' && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-bold text-green-400">Rs. {item.price}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Owner</span>
                <span className="font-medium">{item.owner?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;