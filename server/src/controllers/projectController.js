import Project from '../models/Project.js';
import User from '../models/User.js';

/**
 * Project Controller
 * Handles project CRUD and team management
 */

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const { category, status } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const projects = await Project.find(filter)
      .populate('creator', 'name profileImage')
      .populate('teamMembers', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get single project
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator', 'name profileImage email')
      .populate('teamMembers', 'name profileImage')
      .populate('likes', 'name');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Increment views
    project.views += 1;
    await project.save();

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create project
export const createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      creator: req.userId,
      teamMembers: [req.userId],
    };

    const project = await Project.create(projectData);
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, creator: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      creator: req.userId,
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Like project
export const likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const userId = req.userId;
    const hasLiked = project.likes.includes(userId);

    if (hasLiked) {
      project.likes = project.likes.filter(id => id.toString() !== userId);
    } else {
      project.likes.push(userId);
    }

    await project.save();

    res.json({ 
      success: true, 
      liked: !hasLiked, 
      likes: project.likes.length 
    });
  } catch (error) {
    console.error('Like project error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Invite to team
export const inviteToTeam = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.creator.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only the creator can invite' });
    }

    if (project.teamMembers.includes(userId)) {
      return res.status(400).json({ error: 'User already in team' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    project.teamMembers.push(userId);
    await project.save();

    res.json({ success: true, message: 'User invited to team' });
  } catch (error) {
    console.error('Invite to team error:', error);
    res.status(500).json({ error: error.message });
  }
};