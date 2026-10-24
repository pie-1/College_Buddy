import { motion } from 'framer-motion';

const StepDetails = ({ data, onChange, onNext, onBack }) => {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-800">Your Details</h2>
      
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester / Year</label>
          <select
            value={data.semester}
            onChange={(e) => onChange('semester', e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/30"
          >
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>Semester {num}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hostel (Optional)</label>
          <input
            type="text"
            value={data.hostel}
            onChange={(e) => onChange('hostel', e.target.value)}
            placeholder="e.g., Boys Hostel A"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Optional)</label>
          <textarea
            value={data.bio}
            onChange={(e) => onChange('bio', e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/30 resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.semester}
          className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default StepDetails;