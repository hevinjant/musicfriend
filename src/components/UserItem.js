import React from "react";
import { useNavigate } from "react-router-dom";

function UserItem({ user }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user_info"));

  const handleClick = () => {
    if (currentUser.email === user.email) {
      navigate("/profile");
    }
  };

  return (
    <div className="user-item">
      <button
        onClick={handleClick}
        style={{ backgroundColor: "transparent", border: "none" }}
      >
        <img
          className="user-dp"
          src={user.display_picture_url}
          alt="no image"
        />
      </button>
      <p className="display-name">
        <strong>{user.display_name}</strong>
      </p>
    </div>
  );
}

export default UserItem;
