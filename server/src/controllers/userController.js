import User from '../models/User.js';
import Item from '../models/Item.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// Note: Ensure your .env has real Cloudinary keys for uploads to work.
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'college_buddy_avatars' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

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

// @desc    Get any user's profile by ID (Public)
// @route   GET /api/users/:id
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Also fetch the items this user has listed (from dev branch)
    const items = await Item.find({ owner: user._id, status: 'available' });

    res.json({
      ...user.toObject(),
      items: items 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Onboarding - Update current user
// @route   PATCH /api/users/me
export const updateMe = async (req, res) => {
  try {
    const { dept, semester, hostel, bio } = req.body;
    const updateData = { dept, semester, hostel, bio, profileComplete: true };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.profileImage = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshToken -verificationToken');

    res.json(user);
  } catch (error) {
    console.error('Update me error:', error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update logged-in user's profile (from dev branch)
// @route   PATCH /api/users/me/profile
export const updateMyProfile = async (req, res) => {
  try {
    const { name, bio, dept, semester, hostel } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (dept) updateData.dept = dept;
    if (semester) updateData.semester = semester;
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

// Update specific user (Admin or legacy use)
export const updateUser = async (req, res) => {
  try {
    const { name, bio, dept, semester, hostel, phone_num, address, faculty, graduationYear, skills, interests, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio, dept, semester, hostel, phone_num, address, faculty, graduationYear, skills, interests, role },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};