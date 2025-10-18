const express = require('express');
const Event = require('../models/Event');
const router = express.Router();
const authMiddleware = require('../authMiddleware');  // Protect all routes

router.use(authMiddleware);  // All below routes require login

// GET /events - View list of events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().select('-__v');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
});

// POST /events - Create event (organizer is logged-in user)
router.post('/', async (req, res) => {
  const { title, description, date, location, capacity } = req.body;
  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      capacity,
      organizer: req.user.id,  // Logged-in user ID
      registeredUsers: []
    });
    await event.save();
    res.status(201).json({ message: 'Event created', event });
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err.message });
  }
});

// POST /events/:id/join - Join an event
router.post('/:id/join', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.registeredUsers.length >= event.capacity) return res.status(400).json({ message: 'Event is full' });

    if (event.registeredUsers.includes(req.user.id)) return res.status(400).json({ message: 'Already joined' });

    event.registeredUsers.push(req.user.id);
    await event.save();

    res.json({ message: 'Joined event successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error joining event', error: err.message });
  }
});


// DELETE /events/:id/leave - Cancel joining an event
router.delete('/:id/leave', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (!event.registeredUsers.includes(req.user.id)) return res.status(400).json({ message: 'Not joined this event' });

    event.registeredUsers.pull(req.user.id);  // Mongoose pull method
    await event.save();

    res.json({ message: 'Left event successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error leaving event', error: err.message });
  }
});


module.exports = router;