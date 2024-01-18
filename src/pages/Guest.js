import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Guest.css";

function Guest() {
  const navigate = useNavigate();

  return (
    <div className="guest-page">
      <div>Welcome to Music Friend!</div>
      <p>Music is an essential part in </p>
      <p>
        Music Friend is a friendly music-based social media web application that lets people find other people with the same music tastes.
      </p>
      <button onClick={() => {
        navigate(-1);
      }}>
        Back
      </button>
    </div>
  )
  
}

export default Guest;
