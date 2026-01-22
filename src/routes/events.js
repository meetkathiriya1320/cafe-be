import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import eventController from "../controllers/eventController.js";

const { getEvents, addEvent, updateEventController, deleteEventController } = eventController;

const router = express.Router();

// Get all events
router.get("/", getEvents);

// Add new event (admin only)
router.post("/", authenticateToken, addEvent);

// Update event (admin only)
router.put("/:id", authenticateToken, updateEventController);

// Delete event (admin only)
router.delete("/:id", authenticateToken, deleteEventController);

export default router;