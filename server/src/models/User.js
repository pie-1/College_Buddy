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
      index: true 
    },
    password: { type: String, required: true },
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
    avatar: { type: String },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    trustScore: { type: Number, default: 10 },
    phone_num: { type: String },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

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

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;