import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import pkg from "multer-gridfs-storage";
const { GridFsStorage } = pkg;

import mongoose from "mongoose";
import Candidate from "../models/Candidate.js";

const router = express.Router();

// Allow large JSON payloads (for Base64 video uploads)
router.use(express.urlencoded({ limit: "50mb", extended: true }));

const conn = mongoose.connection;

// GridFS Storage for video files
const videoStorage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    if (file.mimetype.startsWith("video/")) {
      return { filename: `video_${Date.now()}` };
    }
    return null;
  },
});
const uploadVideo = multer({ storage: videoStorage });

// Resume PDF upload
const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF allowed"));
  },
});

router.post("/upload", resumeUpload.single("resume"), async (req, res) => {
  try {
    const { firstName, lastName, position, currentPosition, experience } =
      req.body;

    const candidate = new Candidate({
      firstName,
      lastName,
      position,
      currentPosition,
      experience,
      resumeUrl: req.file ? req.file.originalname : "",
    });

    await candidate.save();
    res.json({ message: "Candidate info saved successfully", candidate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Final submission route (resume + video)
router.post("/final-submit", async (req, res) => {
  try {
    console.log(req.body,"req.bodyreq.bodyreq.body");
    
      if (!req.body) {
      console.error("No body received in request");
      return res.status(400).json({ error: "No request body found" });
    }

    // console.log(" Incoming body:", Object.keys(req.body));
    const {
      firstName,
      lastName,
      position,
      currentPosition,
      experience,
      resumeUrl,
      videoData,
    } = req.body || {};

    if (!firstName || !lastName || !position) {
      return res.status(400).json({ error: "Missing candidate details" });
    }

    if (!videoData) {
      return res.status(400).json({ error: "No video data received" });
    }

    let videoBuffer;

    if (typeof videoData === "string" && videoData.startsWith("data:")) {
      //  If Base64 string
      const base64String = videoData.split(",")[1];
      videoBuffer = Buffer.from(base64String, "base64");
    } else if (videoData && typeof videoData === "object") {
      // If it's an object (e.g. JSON-parsed buffer or binary)
      videoBuffer = Buffer.from(Object.values(videoData));
    } else {
      return res.status(400).json({ error: "Invalid video data format" });
    }

    // Save video to MongoDB GridFS
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "videos",
    });

    const uploadStream = bucket.openUploadStream(`video_${Date.now()}.webm`);
    uploadStream.end(videoBuffer);

    uploadStream.on("finish", async () => {
      console.log("Video uploaded to GridFS");

      const candidate = new Candidate({
        firstName,
        lastName,
        position,
        currentPosition,
        experience,
        resumeUrl,
        videoUrl: uploadStream.id, // GridFS file ID
      });

      await candidate.save();
      res
        .status(200)
        .json({ message: "Final submission successful", candidate });
    });
  } catch (err) {
    console.error("Final submit error:", err);
    res.status(500).json({ error: err.message });
  }
});

//  Route to stream video by ID
router.get("/video/:id", async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "videos",
    });

    const downloadStream = bucket.openDownloadStream(fileId);
    res.set("Content-Type", "video/webm");

    downloadStream.pipe(res);

    downloadStream.on("error", (err) => {
      res.status(404).json({ message: "Video not found", error: err.message });
    });
  } catch (error) {
    console.error(" Error fetching video:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

process.on("uncaughtException", (err) => {
  console.error(" Uncaught Exception:", err);
});

export default router;
