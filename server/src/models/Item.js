import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    category: {
      type: String,
      enum: ['BOOKS', 'TOOLS', 'NOTES', 'GAMES', 'ELECTRONICS', 'OTHER'],
      required: true,
    },
    condition: {
      type: String,
      enum: ['NEW', 'GOOD', 'FAIR', 'WORN'],
      required: true,
    },
    images: [{ 
      type: String 
    }],
    pdfUrl: { 
      type: String 
    },
    listingType: {
      type: String,
      enum: ['borrow', 'sell', 'buy'],
      default: 'borrow',
    },
    price: {
      type: Number,
    },
    tags: [{ 
      type: String 
    }],
    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    status: {
      type: String,
      enum: ['available', 'borrowed', 'unavailable'],
      default: 'available',
    },
    views: { 
      type: Number, 
      default: 0 
    },
  },
  { timestamps: true }
);

// Validation to ensure max 3 images
itemSchema.path('images').validate(function (value) {
  return value.length <= 3;
}, 'You can upload a maximum of 3 images.');

// Indexes
itemSchema.index({ title: 'text', tags: 'text' });
itemSchema.index({ category: 1 });
itemSchema.index({ owner: 1 });
itemSchema.index({ status: 1 });

const Item = mongoose.model('Item', itemSchema);
export default Item;