import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getGallery,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryController.js";

const router = express.Router();

// GET /api/gallery - Fetch all gallery images
router.get("/", getGallery);

// POST /api/gallery - Add new gallery image (Admin only)
router.post("/", authenticateToken, addGalleryImage);

// PUT /api/gallery/:id - Update gallery image (Admin only)
router.put("/:id", authenticateToken, updateGalleryImage);

// DELETE /api/gallery/:id - Delete gallery image (Admin only)
router.delete("/:id", authenticateToken, deleteGalleryImage);

export default router;
