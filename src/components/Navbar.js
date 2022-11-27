import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../redux/action";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navbarItem = "navbar-item";

  const handleSignOut = () => {
    // clear access token
    dispatch(setAccessToken(""));
    localStorage.setItem("access_token", "");
    navigate("/");
  };

  const styles = {
    textDecoration: "none",
    color: "white",
    border: "none",
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
      <Link className={navbarItem} to="/home" style={styles}>
        Home
      </Link>
      <Link className={navbarItem} to="/profile" style={styles}>
        Profile
      </Link>
      <button className={navbarItem} onClick={handleSignOut} style={styles}>
        Sign out
      </button>
    </div>
  );
};

export default Navbar;
