import express from "express";
import { initiateRegistration, verifyRegistrationOTP, login, getProfile } from "../controllers/customerController.js";
import { authenticateCustomer } from "../middleware/auth.js";

const router = express.Router();

// POST /api/customers/register - Initiate customer registration (send OTP)
router.post("/register", initiateRegistration);

// POST /api/customers/verify-registration - Verify registration OTP and create account
router.post("/verify-registration", verifyRegistrationOTP);

// POST /api/customers/login - Customer login
router.post("/login", login);

// GET /api/customers/profile - Get customer profile (protected)
router.get("/profile", authenticateCustomer, getProfile);

export default router;