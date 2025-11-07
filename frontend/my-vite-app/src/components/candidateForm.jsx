import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");

  console.log(resume, "resumeresumeresume");

  const handleNext = (e) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !position ||
      !currentPosition ||
      !experience ||
      !resume
    ) {
      setError("⚠️ All fields are required.");
      return;
    }

    if (resume.type !== "application/pdf") {
      setError("⚠️ Resume must be a PDF file.");
      return;
    }

    if (resume.size > 5 * 1024 * 1024) {
      setError("⚠️ Resume must not exceed 5 MB.");
      return;
    }

    // Convert Resume to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Resume = reader.result;

      const formData = {
        firstName,
        lastName,
        position,
        currentPosition,
        experience,
        resume: base64Resume,
        resumeName: resume.name,
      };

      localStorage.setItem("candidateData", JSON.stringify(formData));
      navigate("/video");
    };
    reader.readAsDataURL(resume);
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Candidate Information Form</h3>

      <form className="card p-4 shadow-sm" onSubmit={handleNext}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Position Applied For</label>
          <input
            type="text"
            className="form-control"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Current Position</label>
          <input
            type="text"
            className="form-control"
            value={currentPosition}
            onChange={(e) => setCurrentPosition(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Experience (Years)</label>
          <input
            type="number"
            className="form-control"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Upload Resume (PDF, ≤5MB)</label>
          <input
            type="file"
            className="form-control"
            accept="application/pdf"
            onChange={(e) => setResume(e.target.files[0])}
            required
          />
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Next →
          </button>
        </div>
      </form>
    </div>
  );
}
