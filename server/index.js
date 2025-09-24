import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import echoRoutes from "./routes/echoRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://echoes-g3fa835fp-isaacs-projects-211b44b8.vercel.app/",  // allow your Vite frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

// Root route for testing
app.get("/", (req, res) => {
  res.send("Echoes server is running");
});

// API routes
app.use("/api/echoes", echoRoutes);
app.use("/api", searchRoutes);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
