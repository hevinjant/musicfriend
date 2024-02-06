import React from "react";
import { useNavigate } from "react-router-dom";
import DefaultProfilePict from "../assets/dfpp.jpg";
import DefaultPict from "../assets/dfpic.jpeg";

const UserExploreItem = ({ user }) => {
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
    <div
      className="user-explore-item"
    >
      <button
        onClick={handleClick}
        style={{ backgroundColor: "transparent", border: "none" }}
      >
        <img
          className="user-dp"
          src={
            user.display_picture_url ? user.display_picture_url : DefaultProfilePict
          }
          alt="no image"
          onError={(event) => {
            event.target.src = DefaultProfilePict;
            event.oneerror = null;
          }}
        />

        <img
          className="track-dp"
          src={
            user.favorite_track?.trackImageUrl
              ? user.favorite_track?.trackImageUrl
              : DefaultPict
          }
          alt="no image"
        />
      </button>
      <div
        className="item-text"
      >
        <p
          className="name-text"
        >
          <strong>{user.display_name}</strong>
        </p>
        {user.favorite_track ? (
          <p
            className="track-text"
          >
            {user.favorite_track?.trackName} -{" "}
            {user.favorite_track?.trackArtists}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default UserExploreItem;
