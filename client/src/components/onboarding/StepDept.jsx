import { motion } from 'framer-motion';
import { Code, Building2, Ruler, Monitor } from 'lucide-react';

const DEPTS = [
  { id: 'civil', name: 'Civil', icon: Building2 },
  { id: 'architecture', name: 'Archi', icon: Ruler },
  { id: 'bit', name: 'BIT', icon: Code },
  { id: 'computer', name: 'Computer', icon: Monitor },
];

const StepDept = ({ value, onChange, onNext }) => {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-800">What's your department?</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {DEPTS.map((dept) => {
          const Icon = dept.icon;
          const isSelected = value === dept.id;
          return (
            <button
              key={dept.id}
              onClick={() => onChange(dept.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <Icon size={32} className={isSelected ? 'text-primary-600' : 'text-gray-400'} />
              <span className={`mt-2 font-medium ${isSelected ? 'text-primary-700' : 'text-gray-600'}`}>
                {dept.name}
              </span>
            </button>
          );
        })}
      </div>
      <button
        onClick={onNext}
        disabled={!value}
        className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50"
      >
        Next
      </button>
    </motion.div>
  );
};

export default StepDept;