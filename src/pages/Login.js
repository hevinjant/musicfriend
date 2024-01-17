import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken, setUserInfo } from "../redux/action";
import {
  getUserSpotifyPlaylists,
  getUserSpotifyInfo,
  getUserSpotifyTracks,
  getUserSpotifyTopGenres,
  SPOTIFY_AUTHORIZATION_URL_PARAMETERS,
  getUserSpotifyTopTracks,
} from "../DataManagers/SpotifyManager";
import { useNavigate } from "react-router-dom";
import { useGeolocated } from "react-geolocated";
import CircularProgress from "@mui/material/CircularProgress";
import spotifyIcon from "../assets/spotify-icon.png";
import "../styles/Login.css";

import { insertUserToDatabase } from "../DataManagers/FirebaseManager";

// - before making a request to Spotify API, check if it's not yet an hour after timestamp

function Login() {
  //const [token, setToken] = useState(localStorage.getItem("access_token"));
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  const [token, setToken] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserGeolocation = (spotifyUserInfo) => {
    let userInfo = {};
    const locationIsFound = isGeolocationAvailable && isGeolocationEnabled;

    userInfo = {
      ...spotifyUserInfo,
      long: locationIsFound && coords?.longitude ? coords?.longitude : null,
      lat: locationIsFound && coords?.latitude ? coords?.latitude : null,
    };

    return userInfo;
  };

  const storeToken = (token, current_time) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("token_timestamp", JSON.stringify(current_time));
    setToken(token);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (window.location.hash) {
      const accessToken = hash.split("#").pop().split("&")[0].split("=")[1];
      const current_time = Date.now();
      storeToken(accessToken, current_time);
    }
  }, [window.location]);

  const getUserInfo = (token) => {
    const userInfo = getUserSpotifyInfo(token).then((spotifyUserInfo) => {
      const res = getUserGeolocation(spotifyUserInfo);
      dispatch(setUserInfo(res));
      localStorage.setItem("user_info", JSON.stringify(res));
      return res;
    });
    return userInfo;
  };

  const getUserAllTracks = (token, userId) => {
    const userAllTracks = getUserSpotifyPlaylists(token, userId).then(
      (playlistsID) => {
        return getUserSpotifyTracks(token, playlistsID).then((tracks) => {
          return tracks;
        });
      }
    );
    return userAllTracks;
  };

  const getUserTopTracks = (token) => {
    const userTopTracks = getUserSpotifyTopTracks(token).then((topTracks) => {
      return topTracks;
    });
    return userTopTracks;
  };

  const getUserTopGenres = (token) => {
    const userTopGenres = getUserSpotifyTopGenres(token).then((topGenres) => {
      return topGenres;
    });
    return userTopGenres;
  };

  const handleClick = async () => {
    setIsLoading(true);

    const userInfo = await getUserInfo(token);
    if (!userInfo && !userInfo.id) {
      return;
    }

    const [userTopTracks, userAllTracks, userTopGenres] = await Promise.all([
      getUserTopTracks(token),
      getUserAllTracks(token, userInfo.id),
      getUserTopGenres(token),
    ]);

    const userTracks = {
      allTracks: userAllTracks,
      topTracks: userTopTracks,
    };

    await insertUserToDatabase(userInfo, userTracks, userTopGenres).then(() => {
      setIsLoading(false);
      navigate("/home");
    });
  };

  return (
    <div className="login">
      <div className="container">
        <h1>Music Friend</h1>
        <div className="spotify-oauth">
          {token ? (
            // Access token received, user can continue to app
            <div className="success-login">
              {isLoading ? (
                <CircularProgress color="success" />
              ) : (
                <>
                  <p>You have successfuly logged in</p>
                  <button onClick={handleClick}>Continue to MusicFriend</button>
                </>
              )}
            </div>
          ) : (
            // Display the login page
            <a
              className="login-button"
              href={SPOTIFY_AUTHORIZATION_URL_PARAMETERS}
            >
              <img className="spotify-icon" src={spotifyIcon}></img>Log in with
              Spotify
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
