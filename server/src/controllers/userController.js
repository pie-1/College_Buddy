import User from '../models/User.js';
import Item from '../models/Item.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -refreshToken -verificationToken')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get logged-in user's profile
// @route   GET /api/users/me
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update logged-in user's profile
// @route   PATCH /api/users/me
export const updateMyProfile = async (req, res) => {
  try {
    const { name, bio, dept, year, hostel } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (dept) updateData.dept = dept;
    if (year) updateData.year = year;
    if (hostel) updateData.hostel = hostel;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get any user's profile by ID (Public)
// @route   GET /api/users/:id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Also fetch the items this user has listed
    const items = await Item.find({ owner: user._id, status: 'available' });

    res.json({
      ...user.toObject(),
      items: items 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all users looking for a roommate
// @route   GET /api/users/roommates
export const getRoommates = async (req, res) => {
  try {
    const roommates = await User.find({ lookingForRoommate: true, isActive: true })
      .select('name dept year avatar bio roommateDetails');
    res.json(roommates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update specific user (Admin or legacy use)
export const updateUser = async (req, res) => {
  try {
    const { name, bio, dept, year, hostel } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio, dept, year, hostel },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};