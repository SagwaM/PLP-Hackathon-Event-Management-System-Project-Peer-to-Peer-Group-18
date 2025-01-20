const Event = require('../public/js/events'); // Assuming an Event model is defined
const Registration = require('../public/js/registration'); // Assuming a Registration model for storing user-event relationships
const db = require('../public/js/db'); // Assuming you're using a database connection in a separate file
// Import bcrypt for password hashing and comparison


// Fetch available events
exports.getAvailableEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'available' }); // Only fetch available events
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching events' });
    }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
    const { eventId } = req.params;
    const { userId } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Save registration to database (you can also check for double registration here)
        const registration = new Registration({
            userId: userId,
            eventId: eventId,
            status: 'pending', // Or 'confirmed', depending on the logic
        });

        await registration.save();
        res.json({ success: true, message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed' });
    }
};

// Function to get all events
exports.getAllEvents = (req, res) => {
    db.query('SELECT * FROM events', (err, results) => {
        if (err) {
            console.error('Error fetching events: ', err);
            return res.status(500).json({ message: 'Error fetching events' });
        }
        res.json(results);
    });
};

// Function to add a new event
exports.addEvent = (req, res) => {
    const { title, event_date, category, description } = req.body;
    db.query('INSERT INTO events (title, event_date, category, description) VALUES (?, ?, ?, ?)', 
    [title, event_date, category, description], (err, result) => {
        if (err) {
            console.error('Error adding event:', err);
            return res.status(500).json({ success: false, message: 'Error adding event' });
          }
        res.json({ message: 'Event added successfully' });
    });
};

// Function to delete an event
exports.deleteEvent = (req, res) => {
    const eventId = req.params.id;
    db.query('DELETE FROM events WHERE events_id = ?', [eventId], (err, result) => {
        if (err) {
            console.error('Error deleting event:', err);
            return res.status(500).json({ success: false, message: 'Error deleting event' });
          }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    });
};

// Function to update an event
exports.updateEvent = (req, res) => {
    const eventId = req.params.id;
    const { title, event_date, category, description } = req.body;
    
    db.query('UPDATE events SET title = ?, event_date = ?, category = ?, description = ? WHERE events_id = ?', 
    [title, event_date, category, description, eventId], (err, result) => {
        if (err) {
            console.error('Error updating event:', err);
            return res.status(500).json({ success: false, message: 'Error updating event' });
          }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event updated successfully' });
    });
};

//Fetch details of a single event by ID
exports.getEventById = (req, res) => {
  const eventId = req.params.id;
  db.query('SELECT * FROM events WHERE events_id = ?', [eventId], (err, result) => {
    if (err) {
      console.error('Error fetching event:', err);
      return res.status(500).json({ success: false, message: 'Error fetching event' });
    }
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: result[0] });
  });
};

// Fetch upcoming events
exports.getUpcomingEvents = (req, res) => {
  const query = 'SELECT * FROM events WHERE event_date > CURDATE()';  // Ensure you use the correct field for event_date
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching upcoming events:', err);
          res.status(500).send({ message: 'Server error while fetching upcoming events' });
      } else {
          console.log('Upcoming events:', results);  // Debugging line
          if (results.length === 0) {
              res.status(404).send({ message: 'No upcoming events found' });
          } else {
              res.status(200).json(results);
          }
      }
  });
};

// Search events based on query
exports.searchEvents = (req, res) => {
  const query = req.query.query;
  const searchQuery = `SELECT * FROM events WHERE title LIKE ? OR description LIKE ?`;
  db.query(searchQuery, [`%${query}%`, `%${query}%`], (err, results) => {
      if (err) {
          console.error('Error searching for events:', err);
          res.status(500).send({ message: 'Server error while searching for events' });
      } else {
          res.status(200).json(results);
      }
  });
};

