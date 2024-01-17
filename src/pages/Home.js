import React, { useEffect, useState, useRef } from "react";
import UserItem from "../components/UserItem";
import Form from "../components/Form";
import SongItem from "../components/SongItem";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import {
  getUserIdByDisplayName,
  insertMatchResultToDatabase,
  getAllUsersFromDatabase,
} from "../DataManagers/FirebaseManager";
import { getMatchesGenres, getMatchesTracks, getMatchesTopTracks } from "../DataManagers/Util";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import ExploreList from "../components/ExploreList";
import GenresList from "../components/GenresList";
import TracksList from "../components/TracksList";
import { Divider } from "@mui/material";

function Home() {
  const navigate = useRef(useNavigate());
  const [searched, setSearched] = useState(false);
  const [track, setTrack] = useState({});
  const [matchesInfo, setMatchesInfo] = useState({});
  const [nearbyUsers, setNearbyUsers] = useState([]);

  const user = useSelector((state) => state.userInfo.user_info);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken === "") {
      navigate.current("/");
    }

    getAllUsersFromDatabase().then((res) => {
      setNearbyUsers(res);
    });
  }, []);

  const _getMatchesTracks = (userId, otherUserId) => {
    const matchesTracks = getMatchesTracks(userId, otherUserId).then(
      (result) => {
        return result;
      }
    );
    return matchesTracks;
  };

  const _getMatchesTopTracks = (userId, otherUserId) => {
    const matchesTopTracks = getMatchesTopTracks(userId, otherUserId).then(
      (result) => {
        return result;
      }
    );
    return matchesTopTracks;
  };

  const _getMatchesGenres = (userId, otherUserId) => {
    const matchesGenres = getMatchesGenres(userId, otherUserId).then(
      (result) => {
        return result;
      }
    );
    return matchesGenres;
  };

  /* Get the matching tracks and matching percentage of users */
  const getSearchResult = async (otherUserName) => {
    const otherUserId = await getUserIdByDisplayName(otherUserName).then(
      (otherUserIds) => {
        if (otherUserIds.length > 0) {
          const otherUserId = otherUserIds[0];
          return otherUserId;
        } else {
          console.log("User not found.");
          return null;
        }
      }
    );

    if (!otherUserId) {
      console.log("Unable to find user.")
      return;
    }

    const [trackMatches, topTrackMatches, genresMatches] = await Promise.all([
      _getMatchesTracks(user.id, otherUserId),
      _getMatchesTopTracks(user.id, otherUserId),
      _getMatchesGenres(user.id, otherUserId),
    ]);

    const matchesResult = {
      tracksPercentage: trackMatches.percentage,
      similarTracks: trackMatches.matches,
      topTracksPercentage: topTrackMatches.percentage,
      similarTopTracks: topTrackMatches.matches,
      genresPercentage: genresMatches.percentage,
      similarGenres: genresMatches.matches,
      otherUserInfo: trackMatches.otherUserInfo,
      timestamp: Date.now(),
    };

    setMatchesInfo(matchesResult);
    insertMatchResultToDatabase(user.id, matchesResult);
    setSearched(true);
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

  const searchBarAndPeopleList = () => {
    return (
      <div className="search-and-people">
        {displaySearch()}
        <div className="people-list"></div>
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
          <button onClick={handleSearchAgain}>Search Again</button>
        </div>
        <div className="match-body">
          <div className="genres-match">
            <p className="match-percentage">
              Your top genres match{" "}
              <strong>{matchesInfo.genresPercentage}%</strong>
            </p>
            <p className="match-total">
              {matchesInfo.similarGenres.length} total match genre(s)
            </p>
            <div className="genres-list">
              <GenresList genres={matchesInfo.similarGenres} />
            </div>
          </div>
          <hr style={{borderColor: "#3d3d3d"}} />
          <div className="top-tracks-match">
            <p className="match-percentage">
              Your top listened songs match{" "}
              <strong>{matchesInfo.topTracksPercentage}%</strong>
            </p>
            <p className="match-total">
              {matchesInfo.similarTopTracks.length} total match top listened song(s)
            </p>
            <div className="track-list" style={{ marginBottom: "100px" }}>
              <TracksList tracks={matchesInfo.similarTopTracks} />
            </div>
          </div>
          <hr style={{borderColor: "#3d3d3d"}} />
          <div className="tracks-match">
            <p className="match-percentage">
              Your playlist songs match{" "}
              <strong>{matchesInfo.tracksPercentage}%</strong>
            </p>
            <p className="match-total">
              {matchesInfo.similarTracks.length} total match song(s)
            </p>
            <div className="track-list" style={{ marginBottom: "100px" }}>
              <TracksList tracks={matchesInfo.similarTracks} />
            </div>
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
          {searched ? (
            displayResult()
          ) : (
            <>
              {searchBarAndPeopleList()}
              <h3 style={{ color: "#a9a9a9", fontSize: "clamp(12px, 1vw, 25px)" }}>People around you</h3>
              <ExploreList nearbyUsers={nearbyUsers} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
