import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Guards
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Catalogue from './pages/Catalogue';
import ConnectionsPage from './pages/ConnectionsPage';
import Profile from './pages/Profile';
import Inbox from './pages/Inbox';
import Events from './pages/Events';
import Projects from './pages/Projects';
import AddItem from './pages/AddItem';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-primary-900">
        <Navbar />
        <main className="flex-1 pt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalogue" element={<Catalogue />} />

            {/* Protected Routes (Requires Login) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/connections" element={<ConnectionsPage />} />
              <Route path="/profile/:userId?" element={<Profile />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/events" element={<Events />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/add-item" element={<AddItem />} />
            </Route>

            {/* Admin Routes (Requires role="admin") */}
            <Route element={<AdminRoute />}>
              {/* Add admin-only routes here later, e.g.: */}
              {/* <Route path="/admin" element={<AdminDashboard />} /> */}
            </Route>
          </Routes>
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </AuthProvider>
  );
}

export default App;