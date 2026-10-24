import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import StepDept from '../components/onboarding/StepDept';
import StepDetails from '../components/onboarding/StepDetails';
import StepAvatar from '../components/onboarding/StepAvatar';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dept: '',
    semester: '',
    hostel: '',
    bio: '',
    avatar: null,
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append('dept', formData.dept);
      data.append('semester', formData.semester);
      if (formData.hostel) data.append('hostel', formData.hostel);
      if (formData.bio) data.append('bio', formData.bio);
      if (formData.avatar) data.append('image', formData.avatar);

      await api.patch('/users/me', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Force a full page reload to re-hydrate context with new profileComplete
      window.location.href = '/dashboard'; 
    } catch (error) {
      console.error('Onboarding failed', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-primary-600">Step {step} of 3</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepDept
              key="step1"
              value={formData.dept}
              onChange={(v) => setFormData({ ...formData, dept: v })}
              onNext={nextStep}
            />
          )}
          {step === 2 && (
            <StepDetails
              key="step2"
              data={formData}
              onChange={(k, v) => setFormData({ ...formData, [k]: v })}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {step === 3 && (
            <StepAvatar
              key="step3"
              avatar={formData.avatar}
              onChange={(file) => setFormData({ ...formData, avatar: file })}
              onSubmit={handleSubmit}
              onBack={prevStep}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;