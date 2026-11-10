const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Feedback = require('../models/Feedback');
const protect = require('../middleware/protect');

// @route   GET /api/events
// @desc    Get all events (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Populate author's name only (excluding password) and sort by date ascending
    const events = await Event.find()
      .populate('author', 'name')
      .sort({ date: 1 });

    return res.status(200).json(events);
  } catch (error) {
    console.error('Fetch events error:', error);
    return res.status(500).json({ message: 'Server error fetching events' });
  }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Protected (logged-in members only)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, date } = req.body;

    // Validate inputs
    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Please provide title, description, and date' });
    }

    // Create event with logged-in user as author
    const event = await Event.create({
      title,
      description,
      date,
      author: req.user._id
    });

    // Populate author name before sending response
    await event.populate('author', 'name');

    return res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ message: 'Server error creating event' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event (only the author can delete their own event)
// @access  Protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    // Check if event exists
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if logged-in user is the author of this event
    if (event.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized: you can only delete your own events' });
    }

    // Delete associated feedbacks first
    await Feedback.deleteMany({ event: event._id });

    // Delete the event
    await event.deleteOne();

    return res.status(200).json({ message: 'Event and related feedbacks removed successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({ message: 'Server error deleting event' });
  }
});

module.exports = router;

