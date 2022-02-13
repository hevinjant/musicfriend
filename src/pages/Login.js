import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAccessToken, setUserInfo } from "../Redux/action";
import {
  getUserSpotifyPlaylists,
  getUserSpotifyInfo,
  getUserSpotifyTracks,
} from "../DataManagers/SpotifyManager";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";

// Spotify
import {
  OAUTH_SCOPES,
  SPOTIFY_CLIENT_ID,
} from "../DataManagers/SpotifyManager";
import { SpotifyApiContext } from "react-spotify-api";
import { SpotifyAuth, Scopes } from "react-spotify-auth";
import { insertUserToDatabase } from "../DataManagers/FirebaseManager";
import "react-spotify-auth/dist/index.css";

function Login() {
  //const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [token, setToken] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    // fetch user's info
    getUserSpotifyInfo(token).then((userInfo) => {
      // fetch user's tracks
      dispatch(setUserInfo(userInfo));
      localStorage.setItem("user_info", JSON.stringify(userInfo));
      getUserSpotifyPlaylists(token).then((playlistsID) => {
        getUserSpotifyTracks(token, playlistsID).then((tracks) => {
          insertUserToDatabase(userInfo, tracks).then(() => {
            navigate("/home");
          });
        });
      });
    });
  };

  const storeToken = (token) => {
    localStorage.setItem("access_token", token);
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
                dispatch(setAccessToken(token));
                storeToken(token);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
