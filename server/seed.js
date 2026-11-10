require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');

const sampleEvents = [
  {
    title: 'Leadership Workshop 2026',
    description: 'An interactive session on team management and project coordination for student leaders.',
    date: new Date('2026-12-15T10:00:00.0Z')
  },
  {
    title: 'Global Village Cultural Night',
    description: 'Experience cultures from around the world with food, performances, and networking.',
    date: new Date('2026-12-20T18:30:00.0Z')
  },
  {
    title: 'Exchange Participant Briefing',
    description: 'Everything you need to know about preparing for your international volunteering internship.',
    date: new Date('2026-12-25T14:00:00.0Z')
  }
];

const seedDB = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected for seeding...');

    // Clear existing events to prevent duplicates
    await Event.deleteMany({});
    console.log('Existing events cleared.');

    // Find or create a default test author for the events
    let testUser = await User.findOne({ email: 'admin@aiesec.org' });
    if (!testUser) {
      testUser = await User.create({
        name: 'AIESEC Admin',
        email: 'admin@aiesec.org',
        password: 'hashedpassword123' // In real usage, use bcrypt
      });
      console.log('Test user created.');
    }

    // Attach the user ID as the author to each sample event
    const eventsWithAuthor = sampleEvents.map(event => ({
      ...event,
      author: testUser._id
    }));

    // Insert seed data into MongoDB Atlas
    await Event.insertMany(eventsWithAuthor);
    console.log('Sample events successfully seeded into MongoDB Atlas!');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
