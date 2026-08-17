import User from '../models/User.js';

/**
 * User Controller
 * Handles user CRUD operations
 */

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -refreshToken -verificationToken')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get single user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken -verificationToken');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, phone_num, address, faculty, semester, graduationYear, skills, interests, bio } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone_num, address, faculty, semester, graduationYear, skills, interests, bio },
      { new: true, runValidators: true }
    ).select('-password -refreshToken -verificationToken');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: error.message });
  }
};