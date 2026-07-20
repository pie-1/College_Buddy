import { Link } from 'react-router-dom';

/**
 * Footer Component
 * @todo Add social media links
 * @todo Add newsletter signup
 * @todo Add copyright year dynamically
 */

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-800 text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src="/Buddy-logo.png" alt="CollegeBuddy" className="w-10 h-10" />
              <span className="text-xl font-bold text-white font-display">
                College<span className="text-primary-300">Buddy</span>
              </span>
            </Link>
            <p className="mt-2 text-sm text-white/60">
              Share what you have, borrow what you need.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalogue" className="hover:text-white transition">Browse</Link></li>
              <li><Link to="/events" className="hover:text-white transition">Events</Link></li>
              <li><Link to="/projects" className="hover:text-white transition">Projects</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-white mb-3">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="text-white/60 hover:text-white transition">📘</a>
              <a href="#" className="text-white/60 hover:text-white transition">🐦</a>
              <a href="#" className="text-white/60 hover:text-white transition">📷</a>
              <a href="#" className="text-white/60 hover:text-white transition">💼</a>
            </div>
            <p className="mt-3 text-sm text-white/40">
              📧 support@collegebuddy.com
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/40">
          © {currentYear} CollegeBuddy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;