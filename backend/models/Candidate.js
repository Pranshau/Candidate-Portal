import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  position: String,
  currentPosition: String,
  experience: Number,
  resumeUrl: String,
  videoId: String,
});

export default mongoose.model("Candidate", CandidateSchema);
