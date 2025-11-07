import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ReviewPage() {
  const navigate = useNavigate();

  const location = useLocation();
  const { formData, resumeFile, videoData, videoFile } = location.state || {};
  const videoSrc =
    videoFile || videoData || localStorage.getItem("candidateVideo");

  const handleFinalSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/candidates/final-submit",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          position: formData.position,
          currentPosition: formData.currentPosition,
          experience: formData.experience,
          videoData: videoFile, // Base64 video string
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200) {
        localStorage.setItem("submitted", "true");
        localStorage.clear();
        alert("✅ Form submitted successfully!");
        navigate("/success");
      }
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert("Error submitting data. Check backend logs.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Review Your Details</h2>
      {formData ? (
        <>
          <p>
            <b>First Name:</b> {formData.firstName}
          </p>
          <p>
            <b>Last Name:</b> {formData.lastName}
          </p>
          <p>
            <b>Position Applied For:</b> {formData.position}
          </p>
          <p>
            <b>Current Position:</b> {formData.currentPosition}
          </p>
          <p>
            <b>Experience:</b> {formData.experience} years
          </p>

          {resumeFile && (
            <div>
              <p>
                <b>Resume:</b>{" "}
                {typeof resumeFile === "object"
                  ? resumeFile.name
                  : "Uploaded Resume"}
              </p>
              <a
                href={
                  typeof resumeFile === "string"
                    ? resumeFile
                    : URL.createObjectURL(resumeFile)
                }
                download
                className="btn btn-outline-primary btn-sm"
              >
                Download Resume
              </a>
            </div>
          )}

          {videoFile && (
            <div className="mt-3">
              <video
                src={
                  typeof videoFile === "string"
                    ? videoFile
                    : URL.createObjectURL(videoFile)
                }
                controls
                width="300"
              />
            </div>
          )}

          <button onClick={handleFinalSubmit} className="btn btn-success mt-4">
            Final Submit
          </button>
        </>
      ) : (
        <p>No candidate data found</p>
      )}
    </div>
  );
}

export default ReviewPage;
