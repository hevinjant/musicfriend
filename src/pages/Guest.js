import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Guest.css";

function Guest() {
  const navigate = useNavigate();

  return (
    <div className="guest-page">
      <div>Welcome to Music Friend!</div>
<<<<<<< HEAD
      <div className="guest-desc">
        <p>Music is an essential part in </p>
        <p>
          Music Friend is a friendly music-based social media web application
          that lets people find other people with the same music tastes.
        </p>
      </div>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
=======
      <p>Music is an essential part in our lifes.</p>
      <p>
        Music Friend is a friendly music-based social media web application that lets people find other people with the same music tastes.
      </p>
      <button onClick={() => {
        navigate(-1);
      }}>
>>>>>>> 4503779cabafe123cd85c982c0de2b17ba2f707b
        Back
      </button>
    </div>
  );
}

export default Guest;
