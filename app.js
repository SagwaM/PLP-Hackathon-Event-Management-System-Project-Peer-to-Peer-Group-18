const express = require('express');
const mysql = require('mysql2/promise'); // Use mysql2 with promises for cleaner code
const bodyParser = require('body-parser');
const cors = require('cors'); // For handling cross-origin requests
const path = require('path'); // For handling file paths
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Update with your MySQL root password
  database: 'event_manager_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the MySQL database');
    connection.release();
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1); // Exit the process if the database connection fails
  }
})();

// Root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Serve HTML views
app.get('/add-event', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'add-event.html'));
});

app.get('/view-event/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'view-event.html'));
});

// API Endpoints
// Fetch all events
app.get('/api/events', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM events');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch specific event
app.get('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new event
app.post('/api/events', async (req, res) => {
  const { title, description, event_date } = req.body;
  try {
    const [results] = await pool.query(
      'INSERT INTO events (title, description, event_date) VALUES (?, ?, ?)',
      [title, description, event_date]
    );
    res.status(201).json({ message: 'Event created successfully!', id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing event
app.put('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, event_date } = req.body;
  try {
    const [results] = await pool.query(
      'UPDATE events SET title = ?, description = ?, event_date = ? WHERE id = ?',
      [title, description, event_date, id]
    );
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an event
app.delete('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query('DELETE FROM events WHERE id = ?', [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
