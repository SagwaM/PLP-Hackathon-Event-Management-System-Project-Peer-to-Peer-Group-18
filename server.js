require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importing cors package
const bcrypt = require('bcrypt'); // bcrypt for password hashing
// Importing the eventController for handling event routes
const eventController = require('./Controllers/eventController');
const authController = require('./Controllers/authController');
// Create an Express application
const app = express();


// Serve static files from the "public" folder
app.use('/images', express.static('public/images')); 

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Enable CORS for all routes
app.use(cors());

// Middleware for parsing JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Attach the database to the app for reuse in routes
app.locals.db = db;


// Routes
const eventRoutes = require('./routes/eventRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');



// Use routes for events and categories
app.use('/api/events', eventRoutes);
app.use('/api', categoryRoutes);
app.use('/api/auth', authRoutes);

// Route for user login
//app.post('/api/login', authController.login);

// Route to fetch all events
app.get('/api/events', eventController.getAllEvents);

// Route to add a new event
app.post('/api/events', eventController.addEvent);

// Route to delete an event
app.delete('/api/events/:id', eventController.deleteEvent);

// Route to update an event
app.put('/api/events/:id', eventController.updateEvent);

// Route to get event by ID
app.get('/api/events/:id', eventController.getEventById);

// Route to get upcoming events
app.get('/api/upcoming-events', eventController.getUpcomingEvents);

// Route to search events
app.get('/api/search-events', eventController.searchEvents);
// Route to fetch all categories
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Route to add a category
app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Category added successfully' });
  });
});

// Route to delete a category
app.delete('/api/categories/:id', (req, res) => {
  const categoryId = req.params.id;
  db.query('DELETE FROM categories WHERE categories_id = ?', [categoryId], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Category deleted successfully' });
  });
});

// Endpoint to fetch details of a single event by ID
app.get('/api/events/:id', (req, res) => {
  const eventId = req.params.id;
  db.query('SELECT * FROM events WHERE events_id = ?', [eventId], (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

// Endpoint to handle booking submission
app.post('/api/bookings', (req, res) => {
  const { eventId, attendeeName, attendeeEmail } = req.body;
  db.query('INSERT INTO bookings (events_id, attendee_name, attendee_email) VALUES (?, ?, ?)', 
  [eventId, attendeeName, attendeeEmail], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Booking confirmed' });
  });
});


// Health check route
app.get('/', (req, res) => {
  res.send({ message: 'Event Management System API is running!' });
});


// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
