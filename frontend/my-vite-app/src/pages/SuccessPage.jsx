import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
  const isSubmitted = localStorage.getItem("submitted");
  if (!isSubmitted) {
    setTimeout(() => navigate("/"), 100);
  } else {
    localStorage.removeItem("submitted");
  }
}, [navigate]);


  return (
    <div className="container mt-5 text-center">
      <h2>🎉 Your application has been submitted successfully!</h2>
      <p>We will get back to you soon.</p>
      <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
}
