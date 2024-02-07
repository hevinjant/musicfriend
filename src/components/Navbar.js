import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../redux/action";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navbarItem = "navbar-item";
  const currentLoginUser = JSON.parse(localStorage.getItem("user_info"));

  const handleSignOut = () => {
    // clear access token
    dispatch(setAccessToken("", null));
    localStorage.setItem("access_token", "");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link className={navbarItem} to="/home">
        Home
      </Link>
      <Link
        className={navbarItem}
        to={`/profile/${currentLoginUser.id}`}
        state={{
          display_picture_url: currentLoginUser.display_picture_url,
          display_name: currentLoginUser.display_name,
        }}
      >
        Profile
      </Link>
      <button className={navbarItem} onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  );
};

export default Navbar;
