const mongoose = require('mongoose');

// Feedback schema: stores comments/feedback left by members on events
const feedbackSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please enter feedback text'],
    trim: true
  },
  // Reference to the event being reviewed (One-to-Many: 1 Event -> N Feedbacks)
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  // Reference to the user who wrote the feedback
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);

