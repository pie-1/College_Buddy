import User from '../models/User.js';

// Note: Cloudinary is temporarily disabled for testing the onboarding wizard.
// When you have real API keys in your .env file, you can un-comment the cloudinary lines below.

/*
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

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
*/

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

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken -verificationToken');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { dept, semester, hostel, bio } = req.body;
    const updateData = { dept, semester, hostel, bio, profileComplete: true };

    // --- CLOUDINARY UPLOAD TEMPORARILY DISABLED ---
    // if (req.file) {
    //   const result = await uploadToCloudinary(req.file.buffer);
    //   updateData.profileImage = result.secure_url;
    // }
    // ----------------------------------------------

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

export const updateUser = async (req, res) => {
  try {
    const { name, phone_num, address, faculty, semester, graduationYear, skills, interests, bio, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone_num, address, faculty, semester, graduationYear, skills, interests, bio, role },
      { new: true, runValidators: true }
    ).select('-password -refreshToken -verificationToken');

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