import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String },
    
    // Core College Info
    dept: {
      type: String,
      enum: ['COMPUTER', 'CIVIL', 'ARCHI', 'BIT'],
      required: true,
    },
    year: {
      type: Number,
      min: 1,
      max: 4,
      required: true,
    },
    
    // Profile & Recommendations 
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    skills: [{ type: String }], 
    interests: [{ type: String }],

    // Roommate Finder Feature
    lookingForRoommate: { type: Boolean, default: false },
    roommateDetails: {
      preferredLocation: { type: String },
      budget: { type: Number },
      genderPreference: { type: String, enum: ['Any', 'Male', 'Female'] },
      description: { type: String, maxlength: 300 }
    },

    // Auth & System
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    refreshToken: { type: String },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    trustScore: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data from JSON responses
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.verificationToken;
  delete user.__v;
  return user;
};

const User = mongoose.model('User', userSchema);
export default User;