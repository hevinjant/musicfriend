import React, { useEffect, useState } from "react";
import {
  getUserPlaylists,
  getUserSpotifyInfo,
  getUserTracks,
  parseTracks,
} from "../DataManagers/SpotifyManager";
import { useSelector } from "react-redux";
import store from "../redux/store";
import UserItem from "../components/UserItem";
import Form from "../components/Form";
import "../styles/Home.css";

function Home() {
  const [userInfo, setUserInfo] = useState({});
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [searched, setSearched] = useState(false);
  const [track, setTrack] = useState({});
  //const token = useSelector((state) => state.token.access_token);

  useEffect(() => {
    console.log("token:", token);
    getUserSpotifyInfo(token).then((user) => {
      console.log("user:", user);
      setUserInfo(user);
    });
    getUserPlaylists(token).then((playlistsID) => {
      console.log("PlaylistsID:", playlistsID);
      getUserTracks(token, playlistsID).then((tracks) => {
        console.log("Tracks-Home:", tracks);
      });
    });
  }, [token]);

  const handleFormSubmit = () => {};

  const handleClick = () => {};

  const displaySearch = () => {
    return (
      <div className="display-search">
        <Form
          formLabel=""
          placeholder="Search a music friend"
          handleFormSubmit={handleFormSubmit}
        />
        <button onClick={handleClick}>Search</button>
        <p>
          The person you search must have logged in at least once to Music
          Friend to be searchable.
        </p>
      </div>
    );
  };

  const displayResult = () => {
    return <div className="display-result"></div>;
  };

  return (
    <div className="home">
      <div className="home-left">
        <UserItem user={userInfo} />
      </div>
      <div className="home-right">
        {track.imageUrl && (
          <div
            className="bg-image"
            style={{ backgroundImage: `url(${track.imageUrl})` }}
          ></div>
        )}
        {searched ? displayResult() : displaySearch()}
      </div>
    </div>
  );
}

export default Home;
