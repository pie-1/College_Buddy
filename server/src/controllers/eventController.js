import Event from '../models/Event.js';

/**
 * Event Controller
 * Handles event CRUD and participation
 */

// Get all events
export const getEvents = async (req, res) => {
  try {
    const { category, status } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const events = await Event.find(filter)
      .populate('organizer', 'name email profileImage')
      .populate('participants', 'name profileImage')
      .sort({ eventDate: 1 });

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get single event
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email profileImage')
      .populate('participants', 'name profileImage');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create event
export const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.userId,
    };

    const event = await Event.create(eventData);
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizer: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
    }

    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      organizer: req.userId,
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found or unauthorized' });
    }

    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Join event
export const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.participants.includes(req.userId)) {
      return res.status(400).json({ error: 'Already joined' });
    }

    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ error: 'Event is full' });
    }

    event.participants.push(req.userId);
    await event.save();

    res.json({ success: true, message: 'Joined event successfully' });
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Leave event
export const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.participants = event.participants.filter(
      p => p.toString() !== req.userId
    );
    await event.save();

    res.json({ success: true, message: 'Left event successfully' });
  } catch (error) {
    console.error('Leave event error:', error);
    res.status(500).json({ error: error.message });
  }
};