import BorrowRequest from '../models/BorrowRequest.js';
import Item from '../models/Item.js';

/**
 * Borrow Controller
 * Handles borrowing requests
 */

// Create borrow request
export const createRequest = async (req, res) => {
  try {
    const { itemId, expected_return_date, notes } = req.body;
    const borrower = req.userId;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (!item.is_available) {
      return res.status(400).json({ error: 'Item is not available' });
    }

    if (item.owner.toString() === borrower.toString()) {
      return res.status(400).json({ error: 'You cannot borrow your own item' });
    }

    const borrowRequest = await BorrowRequest.create({
      item: itemId,
      borrower,
      owner: item.owner,
      expected_return_date,
      notes,
    });

    res.status(201).json(borrowRequest);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get my requests (as borrower)
export const getMyRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ borrower: req.userId })
      .populate('item', 'title image_urls')
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get my lending (as owner)
export const getMyLending = async (req, res) => {
  try {
    const requests = await BorrowRequest.find({ owner: req.userId })
      .populate('item', 'title image_urls')
      .populate('borrower', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Get my lending error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get single request
export const getRequest = async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id)
      .populate('item')
      .populate('borrower', 'name email profileImage')
      .populate('owner', 'name email profileImage');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check if user is part of the request
    if (request.borrower._id.toString() !== req.userId && 
        request.owner._id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(request);
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Accept request
export const acceptRequest = async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only the owner can accept' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request already processed' });
    }

    request.status = 'accepted';
    await request.save();

    // Update item availability
    await Item.findByIdAndUpdate(request.item, { is_available: false });

    res.json({ success: true, message: 'Request accepted', request });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Decline request
export const declineRequest = async (req, res) => {
  try {
    const { decline_reason } = req.body;
    const request = await BorrowRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only the owner can decline' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request already processed' });
    }

    request.status = 'declined';
    request.decline_reason = decline_reason || 'Declined by owner';
    await request.save();

    res.json({ success: true, message: 'Request declined', request });
  } catch (error) {
    console.error('Decline request error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Return request
export const returnRequest = async (req, res) => {
  try {
    const request = await BorrowRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only the owner can mark as returned' });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({ error: 'Request must be accepted first' });
    }

    request.status = 'returned';
    request.return_date = new Date();
    await request.save();

    // Update item availability
    await Item.findByIdAndUpdate(request.item, { is_available: true });

    res.json({ success: true, message: 'Item returned successfully', request });
  } catch (error) {
    console.error('Return request error:', error);
    res.status(500).json({ error: error.message });
  }
};