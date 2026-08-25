import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Package, 
  BookOpen, 
  Calendar, 
  Users, 
  ArrowRight,
  TrendingUp,
  Clock,
  MessageCircle,
  Plus,
  Eye,
  Heart,
  Share2
} from 'lucide-react';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    itemsShared: 12,
    projectsJoined: 3,
    eventsAttending: 2,
    connections: 28,
    itemsBorrowed: 5,
    itemsLiked: 8,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'shared',
      title: 'Data Structures Textbook',
      department: 'Computer',
      time: '2 hours ago',
      icon: '📚',
      status: 'active'
    },
    {
      id: 2,
      type: 'borrowed',
      title: 'Engineering Calculator',
      department: 'Civil',
      time: '1 day ago',
      icon: '📱',
      status: 'pending'
    },
    {
      id: 3,
      type: 'liked',
      title: 'Architecture Portfolio Template',
      department: 'Architecture',
      time: '3 days ago',
      icon: '🎨',
      status: 'active'
    },
    {
      id: 4,
      type: 'message',
      title: 'New message from Alice Johnson',
      department: 'Inbox',
      time: '5 hours ago',
      icon: '💬',
      status: 'unread'
    },
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: 'Tech Talk: AI in Education',
      date: 'July 25, 2026',
      time: '3:00 PM',
      location: 'Room 101',
      attendees: 45
    },
    {
      id: 2,
      title: 'Civil Engineering Workshop',
      date: 'July 28, 2026',
      time: '10:00 AM',
      location: 'Engineering Hall',
      attendees: 32
    },
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container-custom section-padding"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient">
              Welcome back, {user?.name || 'Buddy'}! 👋
            </h1>
            <p className="text-primary-500 dark:text-primary-400 mt-1">
              Here's what's happening in your community today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/add-item">
              <Button variant="primary" size="sm">
                <Plus size={18} /> Share an Item
              </Button>
            </Link>
            <Link to="/inbox">
              <Button variant="secondary" size="sm">
                <MessageCircle size={18} /> Inbox
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Shared', value: stats.itemsShared, icon: Package, color: 'primary' },
          { label: 'Projects', value: stats.projectsJoined, icon: BookOpen, color: 'secondary' },
          { label: 'Events', value: stats.eventsAttending, icon: Calendar, color: 'accent' },
          { label: 'Connections', value: stats.connections, icon: Users, color: 'green' },
          { label: 'Borrowed', value: stats.itemsBorrowed, icon: TrendingUp, color: 'purple' },
          { label: 'Liked', value: stats.itemsLiked, icon: Heart, color: 'pink' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card text-center hover:border-primary-300 transition">
              <div className={`p-2 rounded-xl bg-${stat.color}-100 inline-block mb-2`}>
                <Icon className={`w-5 h-5 text-${stat.color}-500`} />
              </div>
              <div className="text-xl font-bold text-primary-800 dark:text-primary-100">
                {stat.value}
              </div>
              <div className="text-xs text-primary-500 dark:text-primary-400">
                {stat.label}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/catalogue" className="card hover:border-primary-300 transition group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary-800 dark:text-primary-100">Browse Items</h3>
              <p className="text-sm text-primary-500 dark:text-primary-400">Find what you need</p>
            </div>
            <ArrowRight size={20} className="text-primary-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>
        <Link to="/projects" className="card hover:border-primary-300 transition group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary-800 dark:text-primary-100">View Projects</h3>
              <p className="text-sm text-primary-500 dark:text-primary-400">Collaborate with peers</p>
            </div>
            <ArrowRight size={20} className="text-primary-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>
        <Link to="/events" className="card hover:border-primary-300 transition group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary-800 dark:text-primary-100">Upcoming Events</h3>
              <p className="text-sm text-primary-500 dark:text-primary-400">Join the community</p>
            </div>
            <ArrowRight size={20} className="text-primary-400 group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="card">
          <h2 className="font-semibold text-primary-800 dark:text-primary-100 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-primary-500" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center gap-4 p-3 bg-primary-50 dark:bg-primary-800/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-800/50 transition cursor-pointer"
              >
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-primary-800 dark:text-primary-100 text-sm truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-primary-500 dark:text-primary-400">
                      {activity.department}
                    </span>
                    <span className="text-xs text-primary-400 dark:text-primary-500">•</span>
                    <span className="text-xs text-primary-400 dark:text-primary-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
                {activity.status === 'unread' && (
                  <div className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0" />
                )}
                {activity.status === 'pending' && (
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                    Pending
                  </span>
                )}
              </div>
            ))}
          </div>
          <Link to="/inbox" className="mt-4 text-sm text-primary-600 hover:underline flex items-center gap-1">
            View all activity <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={itemVariants} className="card">
          <h2 className="font-semibold text-primary-800 dark:text-primary-100 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-primary-500" />
            Upcoming Events
          </h2>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id}
                className="flex flex-col p-3 bg-primary-50 dark:bg-primary-800/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-800/50 transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <p className="font-medium text-primary-800 dark:text-primary-100 text-sm">
                    {event.title}
                  </p>
                  <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-600 rounded-full">
                    {event.attendees} attending
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1 text-xs text-primary-500 dark:text-primary-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {event.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/events" className="mt-4 text-sm text-primary-600 hover:underline flex items-center gap-1">
            View all events <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* Quick Tips */}
      <motion.div variants={itemVariants} className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-xl border border-primary-200/50 dark:border-primary-800/50">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
            <Share2 size={18} className="text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary-800 dark:text-primary-100">
              💡 Quick Tip: Share items you no longer use
            </p>
            <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
              Your old textbooks, calculators, and notes could help someone else in your department!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;