const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM menu_items ORDER BY category, name');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new menu item (admin only)
router.post('/', authenticateToken, async (req, res) => {
    const { name, category, description, price, image_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO menu_items (name, category, description, price, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, category, description, price, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update menu item (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, category, description, price, image_url } = req.body;
    try {
        const result = await pool.query(
            'UPDATE menu_items SET name = $1, category = $2, description = $3, price = $4, image_url = $5 WHERE id = $6 RETURNING *',
            [name, category, description, price, image_url, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete menu item (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM menu_items WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;