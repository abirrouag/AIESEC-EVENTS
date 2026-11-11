const Feedback = require('../models/Feedback');
const Event = require('../models/Event');

// @desc    Get all feedbacks for a specific event
// @route   GET /api/feedbacks/:eventId
// @access  Public
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ event: req.params.eventId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Fetch feedbacks error:', error);
    return res.status(500).json({ message: 'Server error fetching feedbacks' });
  }
};

// @desc    Add feedback to an event
// @route   POST /api/feedbacks
// @access  Protected (logged-in members only)
const createFeedback = async (req, res) => {
  try {
    const { text, eventId } = req.body;

    // Validate inputs
    if (!text || !eventId) {
      return res.status(400).json({ message: 'Please provide feedback text and eventId' });
    }

    // Verify the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Create feedback
    const feedback = await Feedback.create({
      text,
      event: eventId,
      author: req.user._id
    });

    // Populate author name before returning
    await feedback.populate('author', 'name');

    return res.status(201).json(feedback);
  } catch (error) {
    console.error('Create feedback error:', error);
    return res.status(500).json({ message: 'Server error creating feedback' });
  }
};

// @desc    Delete a feedback (only author can delete)
// @route   DELETE /api/feedbacks/:id
// @access  Protected
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    // Check if feedback exists
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if logged-in user is the author
    if (feedback.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized: you can only delete your own feedback' });
    }

    await feedback.deleteOne();

    return res.status(200).json({ message: 'Feedback removed successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    return res.status(500).json({ message: 'Server error deleting feedback' });
  }
};

module.exports = {
  getFeedbacks,
  createFeedback,
  deleteFeedback
};
