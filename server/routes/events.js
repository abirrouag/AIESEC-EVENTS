const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const protect = require('../middleware/protect');

// @route   GET /api/events
// @desc    Get all events (public)
// @access  Public
router.get('/', getEvents);

// @route   POST /api/events
// @desc    Create a new event
// @access  Protected (logged-in members only)
router.post('/', protect, createEvent);

// @route   PUT /api/events/:id
// @desc    Update an event (only author can update)
// @access  Protected
router.put('/:id', protect, updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete an event (only author can delete)
// @access  Protected
router.delete('/:id', protect, deleteEvent);

module.exports = router;
