import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import candidateRoutes from "./routes/candidateRoutes.js";

// Load environment variables first
dotenv.config();

const app = express();

// Enable CORS first so frontend can send data
app.use(cors({ origin: "http://localhost:5173" }));

// Allow large JSON and form payloads for Base64 video/resume
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(" Missing MONGO_URI in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// API routes
app.use("/api/candidates", candidateRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("🚀 Candidate Portal Backend is running...");
});

//Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
