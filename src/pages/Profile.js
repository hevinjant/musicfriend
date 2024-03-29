import React, { useState, useEffect, useRef } from "react";
import Form from "../components/Form";
import SongItem from "../components/SongItem";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../redux/action";
import TrackList from "../components/TrackList";
import TracksList from "../components/TracksList";
import ArtistsList from "../components/ArtistsList";
import { getSongs, accessTokenIsValid } from "../DataManagers/SpotifyManager";
import {
  changeUserProfilePicture,
  updateUserFavoriteSong,
  getUserFavoriteSong,
  getUserGenres,
  getUserTopTracks,
  getUserTopArtists,
} from "../DataManagers/FirebaseManager";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DefaultProfilePict from "../assets/dfpp.jpg";
import GenresList from "../components/GenresList";
import "../styles/Profile.css";

function Profile() {
  const { userid } = useParams();
  const state = useLocation().state;
  const navigate = useRef(useNavigate());
  const [tracks, setTracks] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
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
      getUserFavoriteSong(userid).then((track) => {
        setFavoriteTrack(track);
      });
      getUserGenres(userid).then((genres) => {
        setGenres(genres);
      });
      getUserTopTracks(userid).then((topTracks) => {
        setTopTracks(topTracks);
      });
      getUserTopArtists(userid).then((topArtists) => {
        setTopArtists(topArtists);
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

  return (
    <div className="profile">
      <Navbar />
      <div className="profile-items">
        <img
          className="user-dp"
          src={
            state.display_picture_url
              ? state.display_picture_url
              : DefaultProfilePict
          }
          alt="no image"
          onError={(event) => {
            event.target.src = DefaultProfilePict;
            event.oneerror = null;
          }}
        />
        <h1>{state.display_name}</h1>
        <h4 className="section-header">Top Genres</h4>
        <div className="top-genres">
          <GenresList genres={genres} />
        </div>
        <h4 className="section-header">Top Artists</h4>
        <div className="top-artists">
          <ArtistsList artists={topArtists} />
        </div>
        <h4 className="section-header">Top Listened Songs</h4>
        <div className="top-tracks">
          <TracksList tracks={topTracks} />
        </div>
        {favoriteTrack ? (
          <div className="favorite-track">
            <h4 className="section-header">Your featured song</h4>
            <SongItem track={favoriteTrack} />
          </div>
        ) : (
          <p>You don't have a featured song.</p>
        )}
        {currentLoginUser.id === userid ? (
          <Form
            formLabel=""
            placeholder="Search for your featured song"
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

export default Profile;
