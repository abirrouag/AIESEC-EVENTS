const mongoose = require('mongoose');

// Event schema: stores AIESEC events created by members
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter an event title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please enter an event description']
    },
    date: {
      type: Date,
      required: [true, 'Please enter the event date']
    },
    // Reference to the user who created this event (One-to-Many: 1 User -> N Events)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Event', eventSchema);

