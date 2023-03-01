import React from "react";
import { useNavigate } from "react-router-dom";
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
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
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
          style={{
            borderRadius: "50%",
            width: "clamp(50px, 4vw, 75px)",
            height: "clamp(50px, 4vw, 75px)",
          }}
        />
        <img
          src={user.favorite_track.trackImageUrl}
          alt="no image"
          style={{
            width: "clamp(50px, 4vw, 75px)",
            height: "clamp(50px, 4vw, 75px)",
          }}
        />
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <p
          className="display-name"
          style={{ color: "white", marginLeft: "10px" }}
        >
          <strong>{user.display_name}</strong>
        </p>

        <p style={{ color: "white", marginLeft: "10px", marginTop: "0px" }}>
          {user.favorite_track.trackName} - {user.favorite_track.trackArtists}
        </p>
      </div>
    </div>
  );
};

export default UserExploreItem;
