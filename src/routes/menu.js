import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";

const router = express.Router();

// Get all menu items
router.get("/", getMenu);

// Add new menu item (admin only)
router.post("/", authenticateToken, addMenuItem);

// Update menu item (admin only)
router.put("/:id", authenticateToken, updateMenuItem);

// Delete menu item (admin only)
router.delete("/:id", authenticateToken, deleteMenuItem);

export default router;
