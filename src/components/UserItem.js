import React from "react";
import { useNavigate } from "react-router-dom";
import DefaultPict from "../assets/dfpic.jpeg";

function UserItem({ user }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${user.id}`, {
      state: {
        display_picture_url: user.display_picture_url,
        display_name: user.display_name,
      },
    });
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
          onError={(event) => {
            event.target.src = DefaultPict;
            event.oneerror = null;
          }}
        />
      </button>
      <p className="display-name">
        <strong>{user.display_name}</strong>
      </p>
    </div>
  );
}

export default UserItem;
