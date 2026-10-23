import mongoose from 'mongoose';
import Item from '../models/Item.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Item Controller
 * Handles all item-related operations
 */

// Get all items with filters
export const getItems = async (req, res) => {
  try {
    const { category, search, status, page = 1, limit = 10 } = req.query;
    let filter = {};

    // Filter by strict category enum
    if (category) filter.category = category;
    
    // Filter by status (available, borrowed, unavailable)
    if (status) filter.status = status;

    // Search filter using text index
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find(filter)
      .populate('owner', 'name avatar email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(filter);

    res.json({
      success: true,
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get single item
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name avatar email phone_num');

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Increment views
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
    const { title, description, category, condition, tags } = req.body;

    // Validate required fields
    if (!title || !description || !category || !condition) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Title, description, category, and condition are required',
      });
    }

    // Handle tags (convert string to array if needed)
    let tagsArray = tags;
    if (typeof tags === 'string') {
      tagsArray = tags.split(',').map(tag => tag.trim());
    }

    // Create item data
    const itemData = {
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      tags: tagsArray || [],
      owner: req.userId,
    };

    // If images were uploaded via Cloudinary/Multer
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ error: 'Maximum 3 images allowed' });
      }
      itemData.images = req.files.map(file => file.path);
    }

    const item = await Item.create(itemData);

    // Populate owner info
    await item.populate('owner', 'name avatar email');

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      item,
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update item (Owner only) - Issue #35
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // ✅ 403 if req.user._id !== item.owner
    if (item.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this item' });
    }

    const { title, description, category, condition, tags, status } = req.body;

    // Update only allowed fields
    if (title) item.title = title.trim();
    if (description) item.description = description.trim();
    if (category) item.category = category;
    if (condition) item.condition = condition;
    if (status) item.status = status;
    if (tags) {
      item.tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
    }

    // If new images uploaded
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ error: 'Maximum 3 images allowed' });
      }
      const newImageUrls = req.files.map(file => file.path);
      item.images = [...(item.images || []), ...newImageUrls];
    }

    const updatedItem = await item.save();
    await updatedItem.populate('owner', 'name avatar email');

    res.json({
      success: true,
      message: 'Item updated successfully',
      item: updatedItem,
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete item (Owner only) - Issue #35
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // ✅ 403 if req.user._id !== item.owner
    if (item.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this item' });
    }

    // Delete images from Cloudinary
    if (item.images && item.images.length > 0) {
      for (const imageUrl of item.images) {
        try {
          const publicId = imageUrl.split('/').pop()?.split('.')[0];
          if (publicId) {
            await cloudinary.uploader.destroy(`collegebuddy/${publicId}`);
          }
        } catch (err) {
          console.error('Failed to delete image:', err);
        }
      }
    }

    // ✅ Hard delete for MVP
    await Item.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
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

// Get items by user
export const getItemsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await Item.find({ owner: userId, status: 'available' })
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Get items by user error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Toggle availability (status change)
export const toggleAvailability = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // ✅ Check if the logged-in user is the owner
    if (item.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden: You do not own this item' });
    }

    // Toggle between 'available' and 'unavailable'
    item.status = item.status === 'available' ? 'unavailable' : 'available';
    await item.save();

    res.json({
      success: true,
      message: `Item is now ${item.status}`,
      item,
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({ error: error.message });
  }
};