import express from "express";
import authRoutes from "./auth.js";
import menuRoutes from "./menu.js";
import contactRoutes from "./contact.js";
import galleryRoutes from "./gallery.js";
import orderRoutes from "./orders.js";

const router = express.Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/menu", menuRoutes);
router.use("/contact", contactRoutes);
router.use("/gallery", galleryRoutes);
router.use("/orders", orderRoutes);

export default router;