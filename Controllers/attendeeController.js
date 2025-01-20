const db = require('../public/js/db');  // Assuming you're using a database helper (e.g., MySQL, MongoDB)

// 1. Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;  // Assuming user authentication middleware
        const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        res.json(user[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// 2. Update User Profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userId = req.user.id;
        const result = await db.query('UPDATE users SET email = ?, password = ? WHERE id = ?', [email, password, userId]);
        res.status(200).send('Profile updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// 3. Get Upcoming Events
exports.getUpcomingEvents = async (req, res) => {
    try {
        const events = await db.query('SELECT * FROM events WHERE event_date > CURDATE()');
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// 4. Register for an Event
exports.registerForEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.eventId;
        const registration = await db.query('INSERT INTO event_registrations (user_id, event_id) VALUES (?, ?)', [userId, eventId]);
        res.status(200).send('Registration successful');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// 5. Get Bookings for the Attendee
exports.getBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await db.query(`
            SELECT events.title, events.event_date, bookings.payment_status
            FROM bookings
            JOIN events ON bookings.event_id = events.id
            WHERE bookings.user_id = ?
        `, [userId]);
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Fetch all events
exports.getEvents = async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM events');
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Fetch categories
exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Fetch all events that the user has registered for
exports.getRegisteredEvents = async (req, res) => {
    const userId = req.user.id; // Assume that user authentication is done and user ID is available
    try {
        const [events] = await db.query(`
            SELECT e.title, e.event_date, e.location, er.registration_id, er.payment_status
            FROM events e
            JOIN event_registrations er ON e.events_id = er.events_id
            WHERE er.users_id = ?
        `, [userId]);
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Cancel registration for an event
exports.cancelRegistration = async (req, res) => {
    const { registrationId } = req.params;
    try {
        const [result] = await db.query('DELETE FROM event_registrations WHERE registration_id = ?', [registrationId]);
        if (result.affectedRows > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Registration not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get payment history of the attendee
exports.getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const [payments] = await db.query(
            'SELECT * FROM payments WHERE users_id = ?',
            [userId]
        );
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
      const userProfile = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
      res.json(userProfile);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
      const { email, password } = req.body; // Assuming the data is sent in the body
      const userId = req.user.id; // Assuming the user ID is stored in the request (via authentication middleware)
      
      const [result] = await pool.query(
        'UPDATE users SET email = ?, password = ? WHERE id = ?',
        [email, password, userId]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'Profile updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
// Example definition for getUpcomingEvents
const getUpcomingEvents = async (req, res) => {
    try {
      // Assuming the event date is stored in 'event_date' field
      const [events] = await pool.query('SELECT * FROM events WHERE event_date > NOW() ORDER BY event_date ASC');
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  

// Register for an event
const registerForEvent = async (req, res) => {
    const { eventId } = req.body;
    const userId = req.user.id;  // Assuming the user ID is available from authentication middleware
    
    try {
      // Insert into registration table (assuming a table named 'registrations')
      const [result] = await pool.query(
        'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
        [userId, eventId]
      );
      res.status(201).json({ message: 'Successfully registered for the event!', registrationId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  
  // Get bookings of the attendee
const getBookings = async (req, res) => {
    const userId = req.user.id;  // Assuming the user ID is available from authentication middleware
    
    try {
      const [bookings] = await pool.query(
        'SELECT * FROM registrations INNER JOIN events ON registrations.event_id = events.events_id WHERE registrations.user_id = ?',
        [userId]
      );
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  
  // Get all events
const getEvents = async (req, res) => {
    try {
      const [events] = await pool.query('SELECT * FROM events');
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  
  // Get all categories
const getCategories = async (req, res) => {
    try {
      const [categories] = await pool.query('SELECT * FROM categories');
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  
  // Get registered events of the attendee
const getRegisteredEvents = async (req, res) => {
    const userId = req.user.id;  // Assuming the user ID is available from authentication middleware
    
    try {
      const [registeredEvents] = await pool.query(
        'SELECT events.* FROM registrations INNER JOIN events ON registrations.event_id = events.events_id WHERE registrations.user_id = ?',
        [userId]
      );
      res.json(registeredEvents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  
  // Cancel registration for an event
const cancelRegistration = async (req, res) => {
    const { registrationId } = req.params;  // Get registration ID from the route parameter
    
    try {
      const [result] = await pool.query('DELETE FROM registrations WHERE registration_id = ?', [registrationId]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      
      res.json({ message: 'Registration cancelled successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  
  // Get payment history of the attendee
const getPaymentHistory = async (req, res) => {
    const userId = req.user.id;  // Assuming the user ID is available from authentication middleware
    
    try {
      const [payments] = await pool.query(
        'SELECT * FROM payments WHERE user_id = ?',
        [userId]
      );
      res.json(payments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
exports.getAttendees = async (req, res) => {
  try {
      const [rows] = await db.query(`
          SELECT attendees.id, attendees.name, attendees.email, events.name AS eventName
          FROM attendees
          JOIN events ON attendees.event_id = events.id
      `);
      res.json(rows);
  } catch (error) {
      console.error("Error fetching attendees:", error);
      res.status(500).send("Server error");
  }
};

// Add an attendee
exports.addAttendee = async (req, res) => {
  const { name, email, eventId } = req.body;
  try {
      await db.query("INSERT INTO attendees (name, email, event_id) VALUES (?, ?, ?)", [name, email, eventId]);
      res.status(201).send("Attendee added successfully");
  } catch (error) {
      console.error("Error adding attendee:", error);
      res.status(500).send("Server error");
  }
};

// Delete an attendee
exports.deleteAttendee = async (req, res) => {
  const { id } = req.params;
  try {
      await db.query("DELETE FROM attendees WHERE id = ?", [id]);
      res.send("Attendee deleted successfully");
  } catch (error) {
      console.error("Error deleting attendee:", error);
      res.status(500).send("Server error");
  }
};
module.exports = { 
    getUserProfile,
    updateUserProfile,
    getUpcomingEvents,
    registerForEvent,
    getBookings,
    getEvents,
    getCategories,
    getRegisteredEvents,
    cancelRegistration,
    getPaymentHistory 
};
