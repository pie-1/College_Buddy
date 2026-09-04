import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Package, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';

// Mock data - replace with API later
const MOCK_BORROWED_ITEMS = [
  {
    id: 1,
    itemTitle: 'Data Structures Textbook',
    ownerName: 'Alice Johnson',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // due in 2 days
  },
  {
    id: 2,
    itemTitle: 'Engineering Calculator',
    ownerName: 'Bob Smith',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // overdue by 1 day
  },
];

const MOCK_INCOMING_REQUESTS = [
  {
    id: 1,
    requesterName: 'Emma Brown',
    requesterAvatar: 'https://eu.ui-avatars.com/api/?name=Emma+Brown&size=64&background=6565C9&color=fff',
    itemTitle: 'React Native Development Kit',
    requestedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    requesterName: 'Frank Miller',
    requesterAvatar: 'https://eu.ui-avatars.com/api/?name=Frank+Miller&size=64&background=6565C9&color=fff',
    itemTitle: 'Architecture Portfolio Template',
    requestedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
];

function ReturnReminder({ itemTitle, ownerName, dueDate, onMarkReturned }) {
  const isOverdue = new Date(dueDate) < new Date();
  const formattedDate = new Date(dueDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="card flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className={`p-2.5 rounded-xl ${
            isOverdue ? 'bg-red-50 text-red-500' : 'bg-primary-50 text-primary-600'
          }`}
        >
          {isOverdue ? <AlertCircle size={20} /> : <Clock size={20} />}
        </div>
        <div>
          <p className="font-medium text-primary-800">{itemTitle}</p>
          <p className="text-sm text-gray-500">
            Borrowed from {ownerName} ·{' '}
            <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
              {isOverdue ? `Overdue since ${formattedDate}` : `Due ${formattedDate}`}
            </span>
          </p>
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={onMarkReturned}>
        Mark Returned
      </Button>
    </div>
  );
}

function BorrowRequest({ requesterName, requesterAvatar, itemTitle, requestedAt, onAccept, onDecline }) {
  const timeAgo = (() => {
    const hours = Math.round((Date.now() - new Date(requestedAt).getTime()) / (60 * 60 * 1000));
    if (hours < 24) return `${hours}h ago`;
    return `${Math.round(hours / 24)}d ago`;
  })();

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <img
          src={requesterAvatar}
          alt={requesterName}
          className="w-11 h-11 rounded-full object-cover"
        />
        <div>
          <p className="text-primary-800">
            <span className="font-semibold">{requesterName}</span> wants to borrow{' '}
            <span className="font-semibold">{itemTitle}</span>
          </p>
          <p className="text-xs text-gray-400">{timeAgo}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onAccept}
          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
          aria-label="Accept request"
        >
          <CheckCircle size={20} />
        </button>
        <button
          onClick={onDecline}
          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
          aria-label="Decline request"
        >
          <XCircle size={20} />
        </button>
      </div>
    </div>
  );
}

export default function InboxPage() {
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInbox = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 600));
        setBorrowedItems(MOCK_BORROWED_ITEMS);
        setIncomingRequests(MOCK_INCOMING_REQUESTS);
      } catch (error) {
        toast.error('Failed to load your inbox');
      } finally {
        setLoading(false);
      }
    };

    loadInbox();
  }, []);

  const handleMarkReturned = (id) => {
    setBorrowedItems((prev) => prev.filter((item) => item.id !== id));
    toast.success('Marked as returned!');
  };

  const handleAccept = (id, requesterName, itemTitle) => {
    setIncomingRequests((prev) => prev.filter((req) => req.id !== id));
    toast.success(`Accepted — ${requesterName} can pick up ${itemTitle}`);
  };

  const handleDecline = (id) => {
    setIncomingRequests((prev) => prev.filter((req) => req.id !== id));
    toast('Request declined', { icon: '👋' });
  };

  if (loading) {
    return (
      <div className="container-custom section-padding">
        <div className="animate-pulse max-w-3xl mx-auto space-y-6">
          <div className="h-8 w-40 bg-primary-200 rounded-lg"></div>
          <div className="h-24 bg-primary-200 rounded-xl"></div>
          <div className="h-24 bg-primary-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-primary-800">Inbox</h1>
          <hr className="border-primary-200 mt-3" />
        </div>

        {/* Your Lending Requests (items you've borrowed and need to return) */}
        <div className="mb-10">
          <h2 className="font-display text-xl font-semibold text-primary-800 mb-4 flex items-center gap-2">
            <Package size={20} className="text-primary-500" />
            Your Lending Requests
            {borrowedItems.length > 0 && ` (${borrowedItems.length})`}
          </h2>
          <div className="space-y-3">
            {borrowedItems.length > 0 ? (
              borrowedItems.map((item) => (
                <ReturnReminder
                  key={item.id}
                  {...item}
                  onMarkReturned={() => handleMarkReturned(item.id)}
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                You have no lending requests/ return reminders.
              </p>
            )}
          </div>
        </div>

        {/* Borrow Requests (people who want to borrow your items) */}
        <div>
          <h2 className="font-display text-xl font-semibold text-primary-800 mb-2 flex items-center gap-2">
            Borrow Requests
            {incomingRequests.length > 0 && ` (${incomingRequests.length})`}
          </h2>
          <div className="flex flex-col">
            {incomingRequests.length > 0 ? (
              incomingRequests.map((request, i) => (
                <div key={request.id}>
                  <BorrowRequest
                    {...request}
                    onAccept={() => handleAccept(request.id, request.requesterName, request.itemTitle)}
                    onDecline={() => handleDecline(request.id)}
                  />
                  {i < incomingRequests.length - 1 && <hr className="border-primary-100" />}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm py-4">You have no borrow requests.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
