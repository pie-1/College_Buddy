import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Wrench, Gamepad2, Laptop, Search } from 'lucide-react';

const Home = () => {
  const categories = [
    { name: 'Books', icon: BookOpen, color: 'bg-primary-100', count: '120+' },
    { name: 'Tools', icon: Wrench, color: 'bg-primary-100', count: '45+' },
    { name: 'Games', icon: Gamepad2, color: 'bg-primary-100', count: '30+' },
    { name: 'Electronics', icon: Laptop, color: 'bg-primary-100', count: '25+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-800 font-display leading-tight">
                Share what you have,
                <br />
                <span className="text-primary-500">borrow what you need</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
                A community-driven lending platform built for students, by students.
                Save money, reduce waste, and build connections.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <Link to="/catalogue" className="btn-primary">
                  Browse Items <ArrowRight size={18} />
                </Link>
                <Link to="/register" className="btn-secondary">
                  Get Started
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
                <span>🎓 1000+ Students</span>
                <span>📚 500+ Items</span>
                <span>🤝 200+ Borrows</span>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1"
            >
              <img
                src="/home-hero-illustration.svg"
                alt="CollegeBuddy illustration"
                className="w-full max-w-md mx-auto"
                onError={(e) => {
                  // Fallback if SVG doesn't load
                  e.target.src = 'https://placehold.co/400x300/575799/FFFFFF?text=CollegeBuddy';
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Floating Decorations */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-primary-200/30 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-primary-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 font-display">
              What can you borrow?
            </h2>
            <p className="mt-2 text-gray-600">Browse items by category</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card text-center cursor-pointer hover:border-primary-400"
                >
                  <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mx-auto`}>
                    <Icon size={28} className="text-primary-600" />
                  </div>
                  <h3 className="mt-3 font-semibold text-primary-800">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} items</p>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link to="/catalogue" className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center gap-2">
              View all categories <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-primary-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 font-display">
              How it works
            </h2>
            <p className="mt-2 text-gray-600">Three simple steps to start sharing</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Share', desc: 'List items you don\'t use daily' },
              { step: '2', title: 'Connect', desc: 'Find what you need in the catalogue' },
              { step: '3', title: 'Borrow', desc: 'Request and pick up from your buddy' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold font-display">
                  {item.step}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-primary-800">{item.title}</h3>
                <p className="mt-1 text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;