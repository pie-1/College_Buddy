import Item from '../models/Item.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Item Controller
 * Handles all item-related operations
 */

// Get all items with filters
export const getItems = async (req, res) => {
  try {
    const { category, search, faculty, available, page = 1, limit = 10 } = req.query;
    let filter = {};

    // Category filter
    if (category) filter.category = category;
    
    // Faculty restriction filter
    if (faculty) filter.facultyRestriction = { $in: [faculty] };
    
    // Availability filter
    if (available === 'true') filter.is_available = true;

    // Search filter
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find(filter)
      .populate('owner', 'name profileImage email faculty')
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
      .populate('owner', 'name profileImage email phone_num faculty')
      .populate({
        path: 'borrowRequests',
        select: 'status borrower expected_return_date',
      });

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

// Create item (ADD ITEM FEATURE)
export const createItem = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      condition,
      tags,
      number_of_items,
      facultyRestriction,
      max_borrow_duration,
      bookDetails,
    } = req.body;

    // Validate required fields
    if (!title || !category || !description) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Title, category, and description are required',
      });
    }

    // Validate category
    const validCategories = ['books', 'tools', 'games', 'electronics', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: 'Invalid category',
        details: `Category must be one of: ${validCategories.join(', ')}`,
      });
    }

    // Validate condition
    const validConditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
    if (condition && !validConditions.includes(condition)) {
      return res.status(400).json({
        error: 'Invalid condition',
        details: `Condition must be one of: ${validConditions.join(', ')}`,
      });
    }

    // Handle tags (convert string to array if needed)
    let tagsArray = tags;
    if (typeof tags === 'string') {
      tagsArray = tags.split(',').map(tag => tag.trim());
    }

    // Handle faculty restriction
    let facultyRestrictionArray = facultyRestriction;
    if (typeof facultyRestriction === 'string') {
      facultyRestrictionArray = facultyRestriction.split(',').map(f => f.trim());
    }

    // Handle book details
    let parsedBookDetails = bookDetails;
    if (typeof bookDetails === 'string') {
      try {
        parsedBookDetails = JSON.parse(bookDetails);
      } catch (e) {
        parsedBookDetails = null;
      }
    }

    // Create item data
    const itemData = {
      title: title.trim(),
      category,
      description: description.trim(),
      condition: condition || 'Good',
      tags: tagsArray || [],
      number_of_items: parseInt(number_of_items) || 1,
      is_available: true,
      owner: req.userId,
      facultyRestriction: facultyRestrictionArray || [],
      max_borrow_duration: parseInt(max_borrow_duration) || 14,
      bookDetails: parsedBookDetails || null,
    };

    // If images were uploaded via Cloudinary
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path);
      itemData.image_urls = imageUrls;
    }

    // If single image uploaded
    if (req.file) {
      itemData.image_urls = [req.file.path];
    }

    const item = await Item.create(itemData);

    // Populate owner info
    await item.populate('owner', 'name profileImage email');

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      item,
    });
  } catch (error) {
    console.error('Create item error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'Item already exists',
        details: 'An item with this title already exists',
      });
    }

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

    const {
      title,
      category,
      description,
      condition,
      tags,
      number_of_items,
      is_available,
      facultyRestriction,
      max_borrow_duration,
      bookDetails,
    } = req.body;

    // Build update object
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (category) updateData.category = category;
    if (description) updateData.description = description.trim();
    if (condition) updateData.condition = condition;
    if (tags) {
      updateData.tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
    }
    if (number_of_items) updateData.number_of_items = parseInt(number_of_items);
    if (is_available !== undefined) updateData.is_available = is_available === 'true';
    if (facultyRestriction) {
      updateData.facultyRestriction = typeof facultyRestriction === 'string' 
        ? facultyRestriction.split(',').map(f => f.trim()) 
        : facultyRestriction;
    }
    if (max_borrow_duration) updateData.max_borrow_duration = parseInt(max_borrow_duration);
    if (bookDetails) {
      updateData.bookDetails = typeof bookDetails === 'string' 
        ? JSON.parse(bookDetails) 
        : bookDetails;
    }

    // If new images uploaded
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => file.path);
      updateData.image_urls = [...(item.image_urls || []), ...newImageUrls];
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name profileImage email');

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
    if (item.image_urls && item.image_urls.length > 0) {
      for (const imageUrl of item.image_urls) {
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
    const items = await Item.find({ owner: userId, is_available: true })
      .populate('owner', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Get items by user error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Toggle availability
export const toggleAvailability = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, owner: req.userId });

    if (!item) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    item.is_available = !item.is_available;
    await item.save();

    res.json({
      success: true,
      message: `Item is now ${item.is_available ? 'available' : 'unavailable'}`,
      item,
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({ error: error.message });
  }
};