import React, { useEffect, useState, useRef } from "react";
import { getUserSpotifyInfo } from "../DataManagers/SpotifyManager";
import UserItem from "../components/UserItem";
import Form from "../components/Form";
import SongItem from "../components/SongItem";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import {
  getUserIdByDisplayName,
  getUserTracks,
  insertMatchResultToDatabase,
} from "../DataManagers/FirebaseManager";
import { getMatchesTracks } from "../DataManagers/Util";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useRef(useNavigate());
  const [searched, setSearched] = useState(false);
  const [track, setTrack] = useState({});
  const [matchesInfo, setMatchesInfo] = useState({});
  //const [token, setToken] = useState(localStorage.getItem("access_token"));
  //const token = useSelector((state) => state.token.access_token);
  const user = useSelector((state) => state.userInfo.user_info);

  useEffect(() => {
    // const usrJSON = localStorage.getItem("user_info");
    // const usr = JSON.parse(usrJSON);
    // console.log("useEffect:", usr);
    // getUserTracks(user.email).then((tracks) => {
    //   console.log("Retrieved tracks:", tracks);
    //   setTrack(tracks);
    // });
    const accessToken = localStorage.getItem("access_token");
    if (accessToken === "") {
      navigate.current("/");
    }
  }, []);

  /* Get the matching tracks and matching percentage of users */
  const getSearchResult = (otherUserName) => {
    getUserIdByDisplayName(otherUserName).then((otherUserIds) => {
      if (otherUserIds.length > 0) {
        const otherUserId = otherUserIds[0];
        getMatchesTracks(user.id, otherUserId).then((result) => {
          setMatchesInfo(result);
          insertMatchResultToDatabase(user.id, result);
          setSearched(true);
          console.log("search result:", result);
        });
      } else {
        console.log("User not found.");
      }
    });
  };

  const handleFormSubmit = (otherUserName) => {
    getSearchResult(otherUserName);
  };

  const handleSearch = (otherUserName) => {
    getSearchResult(otherUserName);
  };

  const displaySearch = () => {
    return (
      <div className="display-search">
        <Form
          formLabel=""
          placeholder="Search a music friend"
          handleFormSubmit={handleFormSubmit}
          handleButtonClick={handleSearch}
        />
        <p>
          The person you search must have logged in at least once to Music
          Friend to be searchable.
        </p>
      </div>
    );
  };

  const handleSearchAgain = () => {
    setSearched(false);
  };

  const displayResult = () => {
    return (
      <div className="display-result">
        <div className="match-header">
          <UserItem user={matchesInfo.otherUserInfo} />
          <div className="match-text">
            <p className="match-percentage">
              Your songs match <strong>{matchesInfo.percentage}%</strong>
            </p>
            <p className="match-total">
              {matchesInfo.matches.length} total match songs
            </p>
          </div>
          <button onClick={handleSearchAgain}>Search Again</button>
        </div>
        <div className="match-body">
          <div className="track-list">
            {matchesInfo.matches.map((track, key) => {
              return <SongItem key={key} track={track} />;
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="home">
        <div className="home-left">
          <UserItem user={user} />
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
    </>
  );
}

export default Home;
