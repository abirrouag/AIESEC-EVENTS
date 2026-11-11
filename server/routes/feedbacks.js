const express = require('express');
const router = express.Router();
const {
  getFeedbacks,
  createFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');
const protect = require('../middleware/protect');

// @route   GET /api/feedbacks/:eventId
// @desc    Get all feedbacks for a specific event
// @access  Public
router.get('/:eventId', getFeedbacks);

// @route   POST /api/feedbacks
// @desc    Add feedback to an event
// @access  Protected (logged-in members only)
router.post('/', protect, createFeedback);

// @route   DELETE /api/feedbacks/:id
// @desc    Delete a feedback (only author can delete)
// @access  Protected
router.delete('/:id', protect, deleteFeedback);

module.exports = router;
