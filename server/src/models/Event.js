import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    eventDate: { type: Date, required: true },
    location: { type: String, required: true },
    category: {
      type: String,
      enum: ['workshop', 'hackathon', 'seminar', 'social', 'project_showcase', 'other'],
      default: 'other',
    },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    facultyRestriction: [{ type: String }],
    maxParticipants: { type: Number },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    image_url: { type: String },
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);


const Event = mongoose.model('Event', eventSchema);
export default Event;