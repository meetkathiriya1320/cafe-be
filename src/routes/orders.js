import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  initiateOrder,
  verifyOTP,
  getCustomerOrders,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { authenticateCustomer } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders/initiate - Initiate order (send OTP)
router.post("/initiate", initiateOrder);

// POST /api/orders/verify-otp - Verify OTP and create order
router.post("/verify-otp", (req, res, next) => {
  // Optional customer authentication
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.split(" ")[1]) {
    authenticateCustomer(req, res, next);
  } else {
    next();
  }
}, verifyOTP);

// GET /api/orders/my-orders - Get customer's order history (Customer only)
router.get("/my-orders", authenticateCustomer, getCustomerOrders);

// GET /api/orders - Get all orders (Admin only)
router.get("/", authenticateToken, getOrders);

// GET /api/orders/:id - Get order details (Admin only)
router.get("/:id", authenticateToken, getOrder);

// PUT /api/orders/:id - Update order status (Admin only)
router.put("/:id", authenticateToken, updateOrderStatus);

// DELETE /api/orders/:id - Delete order (Admin only)
router.delete("/:id", authenticateToken, deleteOrder);

export default router;
