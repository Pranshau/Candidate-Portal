import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    currentPosition: "",
    experience: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.position ||
      !formData.currentPosition ||
      !formData.experience ||
      !formData.resume
    ) {
      alert("Please fill all fields and upload a PDF resume.");
      return;
    }

    if (formData.resume.type !== "application/pdf") {
      alert("Please upload only PDF file.");
      return;
    }

    if (formData.resume.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }
    // Convert PDF to Base64 for saving in localStorage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Resume = reader.result;

      // Create new object with Base64 resume instead of File object
      const formDataToSave = {
        ...formData,
        resume: base64Resume,
      };

      localStorage.setItem("candidateData", JSON.stringify(formDataToSave));
      alert("Information saved successfully!");
      navigate("/video");
    };

    reader.readAsDataURL(formData.resume);
  };

  return (
    <div className="container mt-4">
      <h2>Candidate Information Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Position Applied For</label>
          <input
            type="text"
            name="position"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Current Position</label>
          <input
            type="text"
            name="currentPosition"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Experience (in years)</label>
          <input
            type="number"
            name="experience"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Upload Resume (PDF ≤ 5MB)</label>
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Next
        </button>
      </form>
    </div>
  );
}
