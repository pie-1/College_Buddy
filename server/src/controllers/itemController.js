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

    item.views += 1;
    await item.save();

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create item (Protected + Zod validated + Rate limited)
export const createItem = async (req, res) => {
  try {
    const { title, description, category, condition, tags } = req.body;

    // 1. RATE LIMIT: Max 5 items per user per day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const itemsCreatedToday = await Item.countDocuments({
      owner: req.userId,
      createdAt: { $gte: startOfDay },
    });

    if (itemsCreatedToday >= 5) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        details: 'You can only create a maximum of 5 items per day.',
      });
    }

    // 2. Validate required fields
    if (!title || !description || !category || !condition) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Title, description, category, and condition are required',
      });
    }

    // 3. Handle tags
    let tagsArray = tags;
    if (typeof tags === 'string') {
      tagsArray = tags.split(',').map(tag => tag.trim());
    }

    // 4. Create item data
    const itemData = {
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      tags: tagsArray || [],
      owner: req.userId,
    };

    // 5. Handle images (max 3)
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ error: 'Maximum 3 images allowed' });
      }
      itemData.images = req.files.map((file) => file.path);
    } else if (req.body.images) {
      itemData.images = req.body.images;
    }

    // 6. Save to database
    const item = await Item.create(itemData);

    // 7. Populate owner minimal data
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

// Update item
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, owner: req.userId });

    if (!item) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    const { title, description, category, condition, tags, status } = req.body;

    // Build update object
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (category) updateData.category = category;
    if (condition) updateData.condition = condition;
    if (status) updateData.status = status;
    if (tags) {
      updateData.tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
    }

    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ error: 'Maximum 3 images allowed' });
      }
      const newImageUrls = req.files.map(file => file.path);
      updateData.images = [...(item.images || []), ...newImageUrls];
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name avatar email');

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

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, owner: req.userId });

    if (!item) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
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
    const items = await Item.find({ owner: req.userId }).sort({ createdAt: -1 });
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
    const item = await Item.findOne({ _id: req.params.id, owner: req.userId });

    if (!item) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
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