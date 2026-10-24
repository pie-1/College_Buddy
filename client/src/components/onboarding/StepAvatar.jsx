import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, User } from 'lucide-react';

const StepAvatar = ({ avatar, onChange, onSubmit, onBack }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-800">Profile Picture</h2>
      
      <div className="flex flex-col items-center mb-8">
        <div 
          onClick={() => fileInputRef.current.click()}
          className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary-400 transition overflow-hidden relative group"
        >
          {avatar ? (
            <img src={URL.createObjectURL(avatar)} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User size={40} className="text-gray-400" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <Camera size={24} className="text-white" />
          </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        <p className="text-sm text-gray-500 mt-3">Click to upload (Optional)</p>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">
          Back
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700"
        >
          Finish
        </button>
      </div>
    </motion.div>
  );
};

export default StepAvatar;