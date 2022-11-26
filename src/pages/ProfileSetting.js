import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import { useSelector } from "react-redux";
import TrackList from "../components/TrackList";
import { getSongs } from "../DataManagers/SpotifyManager";
import "../styles/ProfileSetting.css";

function ProfileSetting() {
  const [tracks, setTracks] = useState([]);
  const user = useSelector((state) => state.userInfo.user_info);
  const access_token = localStorage.getItem("access_token");
  // profile pict
  // search bar for track
  // track list

  const handleGetSongs = (token, trackQuery) => {
    getSongs(token, trackQuery).then((tracks) => {
      setTracks(tracks);
    });
  };

  const handleFormSubmit = (trackQuery) => {
    handleGetSongs(access_token, trackQuery);
  };

  const handleSearch = (trackQuery) => {
    handleGetSongs(access_token, trackQuery);
  };

  return (
    <div className="profile-setting">
      <img className="user-dp" src={user.imageUrl} alt="no image" />
      <Form
        formLabel=""
        placeholder="Search a song"
        handleFormSubmit={handleFormSubmit}
        handleButtonClick={handleSearch}
      />
      <TrackList tracks={tracks} />
    </div>
  );
}

export default ProfileSetting;
