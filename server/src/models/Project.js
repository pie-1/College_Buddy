import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['academic', 'personal', 'startup', 'research'],
      required: true,
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lookingForTeammates: { type: Boolean, default: false },
    skillsNeeded: [{ type: String }],
    projectUrl: { type: String },
    githubUrl: { type: String },
    image_urls: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['idea', 'development', 'completed', 'published'],
      default: 'idea',
    },
  },
  { timestamps: true }
);


const Project = mongoose.model('Project', projectSchema);
export default Project;