const express = require('express');
const router = express.Router();
const attendeeController = require('../Controllers/attendeeController');
const { getUserProfile, updateUserProfile } = require('../Controllers/attendeeController');
const { getUpcomingEvents } = require('../Controllers/attendeeController');
const { 
  registerForEvent,
  getBookings,
  getEvents,
  getCategories,
  getRegisteredEvents,
  cancelRegistration,
  getPaymentHistory 
} = require('../Controllers/attendeeController');


const { getAttendees, addAttendee, deleteAttendee } = require('../Controllers/attendeeController');

// Routes
router.get('/', getAttendees); // Fetch all attendees
router.post('/', addAttendee); // Add an attendee
router.delete('/:id', deleteAttendee); // Delete an attendee

module.exports = router;

// Add a route to fetch upcoming events
router.get('/upcoming-events', getUpcomingEvents);

// Use the updateUserProfile in the appropriate route
router.put('/profile', updateUserProfile);

router.get('/', (req, res) => {
    res.send('Attendee routes');
  });
// Fetch all events
router.get('/events', attendeeController.getEvents);

// Fetch categories
router.get('/categories', attendeeController.getCategories);

// Fetch registered events
router.get('/registered-events', attendeeController.getRegisteredEvents);

// Cancel registration for an event
router.delete('/cancel-registration/:registrationId', attendeeController.cancelRegistration);

// Get bookings of the attendee
router.get('/bookings', attendeeController.getBookings);

// Get payment history of the attendee
router.get('/payment-history', attendeeController.getPaymentHistory);

router.get('/profile', getUserProfile);

// Register for an event
router.post('/register', registerForEvent);

// Get bookings of the attendee
router.get('/bookings', getBookings);

// Get all events
router.get('/events', getEvents);

// Get all categories
router.get('/categories', getCategories);

// Get registered events of the attendee
router.get('/registered-events', getRegisteredEvents);

// Cancel registration for an event
router.delete('/cancel-registration/:registrationId', cancelRegistration);

// Get payment history of the attendee
router.get('/payment-history', getPaymentHistory);

module.exports = router;
