import mongoose from 'mongoose';

const borrowRequestSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'returned', 'overdue'],
      default: 'pending',
    },
    expected_return_date: { type: Date, required: true },
    return_date: { type: Date },
    notes: { type: String },
    decline_reason: { type: String },
    isOverdue: { type: Boolean, default: false },
    overdueDays: { type: Number, default: 0 },
  },
  { timestamps: true }
);


const BorrowRequest = mongoose.model('BorrowRequest', borrowRequestSchema);
export default BorrowRequest;