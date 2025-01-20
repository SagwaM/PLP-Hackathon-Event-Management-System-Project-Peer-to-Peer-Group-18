const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/eventController');

// Route to get all available events
router.get('/events', eventController.getAvailableEvents);

// Route for user registration to an event
router.post('/register/:eventId', eventController.registerForEvent);

router.get('/', eventController.getAllEvents); // Fetch all events
router.post('/', eventController.addEvent); // Add a new event
router.delete('/:id', eventController.deleteEvent); // Delete an event
router.put('/:id', eventController.updateEvent); // Update an event
router.get('/:id', eventController.getEventById); // Fetch a single event by ID
router.get('/upcoming', eventController.getUpcomingEvents); // Fetch upcoming events

// Define your event-related routes here
router.get('/create', (req, res) => {
  res.send('Create event page');
});

router.get('/list', (req, res) => {
  res.send('List events page');
});

// Add more event routes as needed
module.exports = router;
