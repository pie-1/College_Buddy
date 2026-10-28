import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Item from '../models/Item.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 12;
    
    if (limit > 50) limit = 50;
    if (limit < 1) limit = 1;

    const skip = (page - 1) * limit;
    const filter = { status: req.query.status || 'available' };
    
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const items = await Item.find(filter)
      .populate('owner', 'name avatar email trustScore dept') 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Item.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: items,
      page,
      totalPages,
      total,
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('owner', 'name avatar dept year trustScore');

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const { title, description, category, condition, tags } = req.body;

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

    if (!title || !description || !category || !condition) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Title, description, category, and condition are required',
      });
    }

    let tagsArray = tags;
    if (typeof tags === 'string') {
      tagsArray = tags.split(',').map(tag => tag.trim());
    }

    const itemData = {
      title: title.trim(),
      description: description.trim(),
      category,
      condition,
      tags: tagsArray || [],
      owner: req.userId,
    };

    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ error: 'Maximum 3 images allowed' });
      }
      
      const imagesArray = [];
      let pdfUrl = null;

      for (const file of req.files) {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        
        if (file.mimetype === 'application/pdf') {
          pdfUrl = fileUrl;
        } else {
          imagesArray.push(fileUrl);
        }
      }

      if (imagesArray.length > 0) itemData.images = imagesArray;
      if (pdfUrl) itemData.pdfUrl = pdfUrl;

    } else if (req.body.images) {
      itemData.images = req.body.images;
    }

    const item = await Item.create(itemData);
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

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, owner: req.userId });

    if (!item) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    const { title, description, category, condition, tags, status } = req.body;

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
      
      const newImageUrls = [];
      for (const file of req.files) {
        newImageUrls.push(`${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
      }
      
      updateData.images = [...(item.images || []), ...newImageUrls];
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name avatar email dept');

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

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, owner: req.userId });

    if (!item) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    if (item.images && item.images.length > 0) {
      for (const imageUrl of item.images) {
        try {
          const filename = imageUrl.split('/').pop();
          const filePath = path.join(__dirname, '../uploads', filename);
          
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
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

export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.userId })
      .populate('owner', 'name avatar email')
      .sort({ createdAt: -1 });
      
    res.json(items);
  } catch (error) {
    console.error('Get my items error:', error);
    res.status(500).json({ error: error.message });
  }
};

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

export const toggleAvailability = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, owner: req.userId });

    if (!item) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

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