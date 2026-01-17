import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// POST /api/orders - Create new order
router.post("/", createOrder);

// GET /api/orders - Get all orders (Admin only)
router.get("/", authenticateToken, getOrders);

// GET /api/orders/:id - Get order details (Admin only)
router.get("/:id", authenticateToken, getOrder);

// PUT /api/orders/:id - Update order status (Admin only)
router.put("/:id", authenticateToken, updateOrderStatus);

// DELETE /api/orders/:id - Delete order (Admin only)
router.delete("/:id", authenticateToken, deleteOrder);

export default router;
