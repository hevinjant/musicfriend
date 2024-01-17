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
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "20px",
      }}
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
          style={{
            borderRadius: "50%",
            width: "clamp(50px, 3vw, 65px)",
            height: "clamp(50px, 3vw, 65px)",
            position: "relative",
            zIndex: "3",
          }}
        />

        <img
          src={
            user.favorite_track?.trackImageUrl
              ? user.favorite_track?.trackImageUrl
              : DefaultPict
          }
          alt="no image"
          style={{
            width: "clamp(50px, 3vw, 65px)",
            height: "clamp(50px, 3vw, 65px)",
            marginLeft: "-10px",
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
          style={{
            color: "white",
            marginLeft: "10px",
            fontSize: "clamp(12px, 0.8vw, 15px)",
          }}
        >
          <strong>{user.display_name}</strong>
        </p>
        {user.favorite_track ? (
          <p
            style={{
              color: "white",
              marginLeft: "10px",
              marginTop: "0px",
              fontSize: "clamp(12px, 0.6vw, 15px)",
            }}
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
