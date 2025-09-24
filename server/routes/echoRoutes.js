import express from "express";
import Echo from "../models/Echo.js";

const router = express.Router();

// POST /api/echoes - create a new echo
router.post("/", async (req, res) => {
  try {
    const echo = new Echo(req.body);
    await echo.save();
    res.status(201).json(echo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/echoes - get all echoes
router.get("/", async (req, res) => {
  try {
    const echoes = await Echo.find().sort({ createdAt: -1 });
    res.json(echoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
