import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

import express from "express";
import cors from "cors";
import { syncDatabase } from "./src/models/index.js";

console.log("Starting server...");

const app = express();
const PORT = process.env.PORT || 5000;

// Sync database
syncDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import router from "./src/routes/index.js";

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Moon Cafe API");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
