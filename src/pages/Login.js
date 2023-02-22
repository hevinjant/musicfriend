import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken, setUserInfo } from "../redux/action";
import {
  getUserSpotifyPlaylists,
  getUserSpotifyInfo,
  getUserSpotifyTracks,
  getUserGenres,
} from "../DataManagers/SpotifyManager";
import { useNavigate } from "react-router-dom";
import { useGeolocated } from "react-geolocated";
import "../styles/Login.css";

// Spotify
import {
  OAUTH_SCOPES,
  SPOTIFY_CLIENT_ID,
} from "../DataManagers/SpotifyManager";
import { SpotifyApiContext } from "react-spotify-api";
import { SpotifyAuth } from "react-spotify-auth";
import { insertUserToDatabase } from "../DataManagers/FirebaseManager";
import "react-spotify-auth/dist/index.css";

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

  // console.log(coords, isGeolocationAvailable, isGeolocationEnabled);

  const [token, setToken] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserGeolocation = (spotifyUserInfo) => {
    let userInfo = {};
    const locationIsFound = isGeolocationAvailable && isGeolocationEnabled;

    userInfo = {
      ...spotifyUserInfo,
      long: locationIsFound ? coords.longitude : null,
      lat: locationIsFound ? coords.latitude : null,
    };

    return userInfo;
  };

  const handleClick = () => {
    // fetch user's info
    getUserSpotifyInfo(token).then((spotifyUserInfo) => {
      // fetch user's tracks
      const userInfo = getUserGeolocation(spotifyUserInfo);
      dispatch(setUserInfo(userInfo));
      localStorage.setItem("user_info", JSON.stringify(userInfo));
      getUserSpotifyPlaylists(token, userInfo.id).then((playlistsID) => {
        getUserSpotifyTracks(token, playlistsID).then((tracks) => {
          getUserGenres(token, tracks).then((genres) => {
            insertUserToDatabase(userInfo, tracks, genres).then(() => {
              navigate("/home");
            });
          });
        });
      });
    });
  };

  const storeToken = (token, current_time) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("token_timestamp", JSON.stringify(current_time));
    setToken(token);
  };

  return (
    <div className="login">
      <div className="container">
        <h1>Music Friend</h1>
        <div className="spotify-oauth">
          {token ? (
            // Access token received, user can continue to app
            <SpotifyApiContext.Provider value={token}>
              <div className="success-login">
                <p>You have successfuly logged in</p>
                <button onClick={handleClick}>Continue to MusicFriend</button>
              </div>
            </SpotifyApiContext.Provider>
          ) : (
            // Display the login page
            <SpotifyAuth
              redirectUri="http://localhost:3000"
              clientID={SPOTIFY_CLIENT_ID}
              scopes={OAUTH_SCOPES}
              onAccessToken={(token) => {
                const current_time = Date.now();
                dispatch(setAccessToken(token, current_time));
                storeToken(token, current_time);
              }}
              showDialog={true} // to always requires user to agree on the Spotify website
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
