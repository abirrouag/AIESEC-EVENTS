const mongoose = require('mongoose');

// User schema: defines the structure for user accounts (members)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Please enter a password']
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('User', userSchema);

