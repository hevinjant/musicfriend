import React, { useState, useEffect, useRef } from "react";
import Form from "../components/Form";
import SongItem from "../components/SongItem";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../redux/action";
import TrackList from "../components/TrackList";
import { getSongs, accessTokenIsValid } from "../DataManagers/SpotifyManager";
import {
  changeUserProfilePicture,
  updateUserFavoriteSong,
  getUserFavoriteSong,
} from "../DataManagers/FirebaseManager";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileSetting.css";

function ProfileSetting() {
  const navigate = useRef(useNavigate());
  const [tracks, setTracks] = useState([]);
  const [favoriteTrack, setFavoriteTrack] = useState(null);
  const user = useSelector((state) => state.userInfo.user_info);
  const access_token = localStorage.getItem("access_token");
  const token_timestamp = localStorage.getItem("token_timestamp");
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const tokenTimestamp = localStorage.getItem("token_timestamp");

    if (!accessTokenIsValid(accessToken, tokenTimestamp)) {
      navigate.current("/");
    } else {
      const userId = JSON.parse(localStorage.getItem("user_info")).id;
      getUserFavoriteSong(userId).then((track) => {
        setFavoriteTrack(track);
      });
    }
  }, []);

  const handleUpdateFavoriteTrack = (track) => {
    setFavoriteTrack(track);
    updateUserFavoriteSong(user, track);
  };

  const handleChangeProfilePicture = (newImageUrl) => {
    const userInfo = { ...user, imageUrl: newImageUrl };
    dispatch(setUserInfo(userInfo));
    changeUserProfilePicture(user, newImageUrl);
  };

  const handleGetSongs = (token, trackQuery) => {
    if (!accessTokenIsValid(access_token, token_timestamp)) {
      navigate.current("/");
      console.log("access token has expired.");
    }

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
      <Navbar />
      <div className="profile-setting-items">
        <img
          className="user-dp"
          src={user.display_picture_url}
          alt="no image"
        />
        <h1>{user.display_name}</h1>
        {favoriteTrack ? (
          <div className="favorite-track">
            <h3 style={{ color: "var(--darker-gray)" }}>Your favorite song</h3>
            <SongItem track={favoriteTrack} />
          </div>
        ) : (
          <p>You don't have a favorite song.</p>
        )}
        <Form
          formLabel=""
          placeholder="Search a new favorite song"
          handleFormSubmit={handleFormSubmit}
          handleButtonClick={handleSearch}
        />
        <TrackList
          tracks={tracks}
          handleUpdateFavoriteTrack={handleUpdateFavoriteTrack}
        />
      </div>
    </div>
  );
}

export default ProfileSetting;
