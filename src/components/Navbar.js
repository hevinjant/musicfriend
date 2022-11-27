import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const styles = {
    textDecoration: "none",
    color: "white",
    borderRadius: "12px",
    backgroundColor: "var(--darkest-gray)",
    width: "140px",
    lineHeight: "40px",
    textAlign: "center",
    fontSize: "20px",
    letterSpacing: "2px",
  };

  return (
    <div className="navbar">
      <Link to="/home" style={styles}>
        Home
      </Link>
      <Link to="/profile" style={styles}>
        Profile
      </Link>
    </div>
  );
};

export default Navbar;
