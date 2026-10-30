import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
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
    images: [{ type: String }],
    pdfUrl: { type: String },
    tags: [{ type: String }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'borrowed', 'unavailable'],
      default: 'available',
    },
    views: { type: Number, default: 0 },

    listingType: {
      type: String,
      enum: ['borrow', 'sell', 'buy'],
      default: 'borrow',
    },
    price: {
      type: Number,
    },
    wantedTags: [{ type: String }],
  },
  { timestamps: true }
);


  return value.length <= 3;
}, 'You can upload a maximum of 3 images.');


itemSchema.pre('validate', function (next) {
  if (this.listingType === 'sell' || this.listingType === 'buy') {
    if (!this.price) {
      this.invalidate('price', 'Price is required when listing type is sell or buy.');
    }
  }

  if (this.listingType === 'buy') {
    if (!this.wantedTags || this.wantedTags.length === 0) {
      this.invalidate('wantedTags', 'wantedTags is required when listing type is buy.');
    }
  }

  next();
});


itemSchema.index({ title: 'text', tags: 'text' });
itemSchema.index({ category: 1 });
itemSchema.index({ owner: 1 });
itemSchema.index({ status: 1 });

const Item = mongoose.model('Item', itemSchema);
export default Item;