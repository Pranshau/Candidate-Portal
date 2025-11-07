import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VideoRecorder() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const dataString = localStorage.getItem("candidateData");
      if (!dataString) {
        alert("⚠️ Please fill the candidate information first!");
        navigate("/");
        return;
      }

      // just check if JSON is valid
      JSON.parse(dataString);
      console.log("✅ candidateData found, safe to continue.");
    } catch (error) {
      console.error("❌ candidateData is corrupted:", error);
      alert("Something went wrong. Please fill the form again.");
      localStorage.removeItem("candidateData");
      navigate("/");
    }
  }, [navigate]);

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [error, setError] = useState("");
  const videoRef = useRef();
  const chunks = useRef([]);
  const timerRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setRecording(true);
      chunks.current = [];

      recorder.ondataavailable = (e) => chunks.current.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
        clearInterval(timerRef.current);
        setSeconds(0);
      };

      recorder.start();

      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 90) {
            stopRecording();
            setError("Video cannot exceed 90 seconds.");
            return 90;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      setError("Camera or microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
  };

  const handleSubmit = () => {
    if (!videoURL) {
      setError("Please record a video before submitting.");
      return;
    }
    // Save candidate info from localStorage
    const candidateData = JSON.parse(localStorage.getItem("candidateData"));

    fetch(videoURL)
      .then((res) => res.blob())
      .then((blob) => {
        const candidateData = JSON.parse(localStorage.getItem("candidateData"));
        const resumeData = candidateData?.resume || null;

        navigate("/review", {
          state: {
            formData: candidateData,
            resumeFile: resumeData,
            videoFile: blob, // send blob directly, not Base64
          },
        });
      })
      .catch(() => {
        setError("Something went wrong while preparing the video.");
      });
  };

  return (
    <div className="container mt-4">
      <h3>Video Recording Instructions</h3>
      <p className="text-secondary">
        Please record a short video (max 90 seconds) covering:
      </p>
      <ul>
        <li>A brief introduction about yourself</li>
        <li>Why you are interested in this position</li>
        <li>Your relevant experience</li>
        <li>Your long-term career goals</li>
      </ul>

      <div className="text-center mt-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="border rounded"
          width="480"
          height="320"
        ></video>
        <div className="mt-3">
          <p>⏱ Duration: {seconds}s / 90s</p>
          {!recording ? (
            <button className="btn btn-success me-2" onClick={startRecording}>
              Start Recording
            </button>
          ) : (
            <button className="btn btn-danger me-2" onClick={stopRecording}>
              Stop Recording
            </button>
          )}
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        {error && <p className="text-danger mt-3">{error}</p>}

        {videoURL && (
          <div className="mt-4">
            <h5>Preview:</h5>
            <video src={videoURL} controls width="480" height="320"></video>
          </div>
        )}
      </div>
    </div>
  );
}
