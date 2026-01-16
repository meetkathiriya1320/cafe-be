const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/gallery - Fetch all gallery images
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gallery_images ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/gallery - Add new gallery image (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  const { image_url, alt_text, description } = req.body;

  if (!image_url) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO gallery_images (image_url, alt_text, description) VALUES ($1, $2, $3) RETURNING *',
      [image_url, alt_text || '', description || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding gallery image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/gallery/:id - Update gallery image (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { image_url, alt_text, description } = req.body;

  if (!image_url) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE gallery_images SET image_url = $1, alt_text = $2, description = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [image_url, alt_text || '', description || '', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery image not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/gallery/:id - Delete gallery image (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM gallery_images WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery image not found' });
    }

    res.json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;