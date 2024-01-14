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
  getUserGenres,
} from "../DataManagers/FirebaseManager";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DefaultPict from "../assets/dfpic.jpeg";
import "../styles/ProfileSetting.css";

function ProfileSetting() {
  const { userid } = useParams();
  const state = useLocation().state;
  const navigate = useRef(useNavigate());
  const [tracks, setTracks] = useState([]);
  const [favoriteTrack, setFavoriteTrack] = useState(null);
  const [genres, setGenres] = useState([]);
  const access_token = localStorage.getItem("access_token");
  const token_timestamp = localStorage.getItem("token_timestamp");
  const currentLoginUser = JSON.parse(localStorage.getItem("user_info"));

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const tokenTimestamp = localStorage.getItem("token_timestamp");

    if (!accessTokenIsValid(accessToken, tokenTimestamp)) {
      navigate.current("/");
    } else {
      console.log("Getting favorite song and genres")
      getUserFavoriteSong(userid).then((track) => {
        setFavoriteTrack(track);
      });
      getUserGenres(userid).then((genres) => {
        setGenres(genres);
      });
    }
  }, []);

  const handleUpdateFavoriteTrack = (track) => {
    setFavoriteTrack(track);
    updateUserFavoriteSong(userid, track);
    setTracks([]);
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

  const genresGrid = (
    <div
      className="genres-grid"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
    >
      {genres.map((genre, idx) => {
        return (
          <p
            key={idx}
            style={{
              textAlign: "center",
              backgroundColor: "#1db954",
              borderRadius: "5px",
              width: "auto",
              padding: "5px",
              fontSize: "12px",
              fontWeight: "700",
              margin: "5px",
            }}
          >
            {genre}
          </p>
        );
      })}
    </div>
  );

  return (
    <div className="profile-setting">
      <Navbar />
      <div className="profile-setting-items">
        <img
          className="user-dp"
          src={state.display_picture_url}
          alt="no image"
          onError={(event) => {
            event.target.src = DefaultPict;
            event.oneerror = null;
          }}
        />
        <h1>{state.display_name}</h1>
        <h3 style={{ color: "var(--darker-gray)" }}>Top Genres</h3>
        {genresGrid}
        {favoriteTrack ? (
          <div className="favorite-track">
            <h3 style={{ color: "var(--darker-gray)" }}>Favorite song</h3>
            <SongItem track={favoriteTrack} />
          </div>
        ) : (
          <p>You don't have a favorite song.</p>
        )}
        {currentLoginUser.id === userid ? (
          <Form
            formLabel=""
            placeholder="Search a new favorite song"
            handleFormSubmit={handleFormSubmit}
            handleButtonClick={handleSearch}
          />
        ) : (
          ""
        )}
        <TrackList
          tracks={tracks}
          handleUpdateFavoriteTrack={handleUpdateFavoriteTrack}
        />
      </div>
    </div>
  );
}

export default ProfileSetting;
