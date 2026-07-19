import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String },
  phone_num: { type: String },
  address: { type: String },
  faculty: {
    type: String,
    enum: ['BE Computer', 'Architecture', 'Civil', 'BIT'],
  },
  studentStatus: {
    type: String,
    enum: ['current', 'passed_out'],
  },
  semester: { type: Number },
  graduationYear: { type: Number },
  profileImage: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  refreshToken: { type: String },
  reputation: { type: Number, default: 0 },
  totalBorrows: { type: Number, default: 0 },
  totalLends: { type: Number, default: 0 },
  skills: [{ type: String }],
  interests: [{ type: String }],
  bio: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);