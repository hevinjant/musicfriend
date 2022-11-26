import React from "react";
import { useNavigate } from "react-router-dom";

function UserItem({ user }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/profile");
  };

  return (
    <div className="user-item">
      <button
        onClick={handleClick}
        style={{ backgroundColor: "transparent", border: "none" }}
      >
        <img className="user-dp" src={user.imageUrl} alt="no image" />
      </button>
      <p className="display-name">
        <strong>{user.displayName}</strong>
      </p>
    </div>
  );
}

export default UserItem;
