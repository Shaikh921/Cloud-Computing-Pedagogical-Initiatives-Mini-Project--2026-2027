import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import userRoutes from "./routes/user.js";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/functions/on_sign_up.js";
import { onTicketCreated } from "./inngest/functions/on-ticketCreate.js";
import { serve } from "inngest/express";
import ticketRoutes from "./routes/ticket.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

const inngestHandler = serve({
  client: inngest,
  functions: [onUserSignup, onTicketCreated],
});

app.use("/api/inngest", inngestHandler);
app.use("/api/inggest", inngestHandler);

// Catch unhandled /api/* requests and return JSON 404 rather than HTML
app.use("/api", (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Serve frontend build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
  });
}

// Start server immediately on port 5000
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB Atlas with retry
const connectWithRetry = async () => {
  const uri = process.env.MONGO_URI || process.env.MONOGO_URI;
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Connected to MongoDB Atlas successfully");
  } catch (e) {
    console.error("Error connecting to MongoDB Atlas:", e.message);
    console.log("Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();
