const bcrypt = require('bcrypt');
// Login function
exports.login = (req, res) => {
    const { username, password } = req.body;
  
    // Query to get user by username
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Error during login query:', err);
        return res.status(500).json({ message: 'Server error during login' });
      }
  
      if (results.length === 0) {
        // No user found with the provided username
        return res.status(404).json({ message: 'Invalid username or password' });
      }
  
      const user = results[0];
  
      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ message: 'Server error during password verification' });
        }
  
        if (!isMatch) {
          // Passwords do not match
          return res.status(401).json({ message: 'Invalid username or password' });
        }
  
        // Successful login
        res.status(200).json({
          message: 'Login successful',
          user: {
            id: user.id,
            username: user.username,
            role: user.role, // Assuming your table has a role column
          },
        });
      });
    });
  };
  
  exports.registerUser = (req, res) => {
    const { username, password, role } = req.body;
  
    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ message: 'Server error during registration' });
      }
  
      // Insert the new user into the database
      db.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, role],
        (err, result) => {
          if (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ message: 'Server error during registration' });
          }
  
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    });
  };