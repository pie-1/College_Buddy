import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['books', 'tools', 'games', 'electronics', 'other'],
      required: true,
    },
    description: { type: String, required: true },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
      default: 'Good',
    },
    tags: [{ type: String }],
    image_urls: [{ type: String }],
    number_of_items: { type: Number, default: 1 },
    is_available: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    facultyRestriction: [{ type: String }],
    borrowCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    max_borrow_duration: { type: Number, default: 14 },
    bookDetails: {
      isbn: { type: String },
      author: { type: String },
      edition: { type: String },
      publisher: { type: String },
      year: { type: Number },
      subject: { type: String },
      course: { type: String },
    },
  },
  { timestamps: true }
);

itemSchema.index({ title: 'text', description: 'text', tags: 'text' });


const Item = mongoose.model('Item', itemSchema);
export default Item;