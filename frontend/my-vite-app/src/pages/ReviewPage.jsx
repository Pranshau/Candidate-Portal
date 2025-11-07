import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function ReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state, "locationstatelocationstate");

  const { formData, resumeFile, videoFile } = location.state || {};
  console.log(resumeFile, "resumefileresumefile");
  console.log(videoFile, "videofilevideofile");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          position: formData.position,
          currentPosition: formData.currentPosition,
          experience: formData.experience,
          videoData: reader.result, //  base64 video string
        };

        const res = await axios.post(
          "http://localhost:5000/api/candidates/final-submit",
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        if (res.status === 200) {
          localStorage.setItem("submitted", "true"); 
          localStorage.removeItem("candidateData"); 
          alert("✅ Form submitted successfully!");
          setTimeout(() => navigate("/success"), 300);
        }
      };

      reader.readAsDataURL(videoFile);
    } catch (err) {
      console.error(" Submission error:", err);
      alert("Error submitting data. Check backend logs.");
      setIsSubmitting(false);
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
            <b>Position:</b> {formData.position}
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
                <b>Resume:</b> {resumeFile.name || "Resume file"}
              </p>
              {(() => {
                try {
                  if (resumeFile instanceof Blob) {
                    return (
                      <a
                        href={URL.createObjectURL(resumeFile)}
                        download="resume.pdf"
                        className="btn btn-outline-primary btn-sm"
                      >
                        Download Resume
                      </a>
                    );
                  } else if (typeof resumeFile === "string") {
                    // Handle base64 resume (if stored that way)
                    return (
                      <a
                        href={resumeFile}
                        download="resume.pdf"
                        className="btn btn-outline-primary btn-sm"
                      >
                        Download Resume
                      </a>
                    );
                  } else {
                    return (
                      <p className="text-danger">⚠️ Invalid resume data</p>
                    );
                  }
                } catch (err) {
                  console.error("📄 Resume render error:", err);
                  return <p className="text-danger">⚠️ Error loading resume</p>;
                }
              })()}
            </div>
          )}

          {/* {videoFile && (
            <div className="mt-3">
              <video
                src={URL.createObjectURL(videoFile)}
                controls
                width="300"
              />
            </div>
          )} */}

          {videoFile ? (
            <div className="mt-3">
              {(() => {
                try {
                  if (videoFile instanceof Blob) {
                    return (
                      <video
                        src={URL.createObjectURL(videoFile)}
                        controls
                        width="300"
                      />
                    );
                  } else if (typeof videoFile === "string") {
                    return <video src={videoFile} controls width="300" />;
                  } else {
                    return (
                      <p className="text-danger">
                        ⚠️ Invalid video data format
                      </p>
                    );
                  }
                } catch (error) {
                  console.error("🎥 Video render error:", error);
                  return <p className="text-danger">⚠️ Error loading video</p>;
                }
              })()}
            </div>
          ) : (
            <p>No video uploaded</p>
          )}

          <button
            onClick={handleFinalSubmit}
            className="btn btn-success mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Final Submit"}
          </button>
        </>
      ) : (
        <p>No candidate data found</p>
      )}
    </div>
  );
}
