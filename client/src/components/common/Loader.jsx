import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [1, 0.7, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="relative flex items-center justify-center w-16 h-16"
      >
        <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
        <motion.div 
          className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <img src="/Buddy-logo.png" alt="Loading" className="w-8 h-8 rounded-full z-10" />
      </motion.div>
      <p className="text-primary-600 font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-primary-900/80">
        {loaderContent}
      </div>
    );
  }

  return <div className="py-20">{loaderContent}</div>;
};

export default Loader;