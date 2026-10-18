import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      index: true // ✅ Email unique + indexed
    },
    password: { type: String, required: true },
    
    // ✅ Enums for Dept, Year, Role
    dept: {
      type: String,
      enum: ['CIVIL', 'ARCHI', 'BIT', 'COMPUTER'],
      required: true,
    },
    year: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true,
    },
    hostel: { type: String },
    avatar: { type: String },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    
    // ✅ Trust Score defaults to 10
    trustScore: { type: Number, default: 10 },

    // Keeping other useful fields from your old model
    phone_num: { type: String },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// ✅ Password hashed with bcrypt (12 rounds)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ toJSON() strips password + __v
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// Method to check password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;