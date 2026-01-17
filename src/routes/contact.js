import express from "express";
import { submitContact } from "../controllers/contactController.js";

const router = express.Router();

// Submit contact form
router.post("/", submitContact);

export default router;
