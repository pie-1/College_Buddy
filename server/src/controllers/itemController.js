import Item from '../models/Item.js';

/**
 * Item Controller
 * @todo Add search functionality
 * @todo Add category filtering
 * @todo Add faculty restriction logic
 */

// Get all items
export const getItems = async (req, res) => {
  try {
    const { category, search, faculty, available } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (faculty) filter.facultyRestriction = { $in: [faculty] };
    if (available) filter.is_available = true;

    if (search) {
      filter.$text = { $search: search };
    }

    const items = await Item.find(filter)
      .populate('owner', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get single item
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name profileImage email phone_num');

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    
    item.views += 1;
    await item.save();

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create item
export const createItem = async (req, res) => {
  try {
    const itemData = {
      ...req.body,
      owner: req.userId,
    };

    const item = await Item.create(itemData);
    res.status(201).json(item);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update item
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    res.json(item);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.userId 
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get my items
export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.userId })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Get my items error:', error);
    res.status(500).json({ error: error.message });
  }
};