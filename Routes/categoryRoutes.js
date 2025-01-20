const express = require('express');
const router = express.Router();
const db = require('../public/js/db'); // Assuming db.js handles DB connections

// Add Category Route
router.post('/add-category', async (req, res) => {
    try {
        const { categoryName } = req.body;

        if (!categoryName) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const query = 'INSERT INTO categories (name) VALUES (?)';
        await db.query(query, [categoryName]);

        return res.status(201).json({ message: 'Category added successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding category' });
    }
});

module.exports = router;
