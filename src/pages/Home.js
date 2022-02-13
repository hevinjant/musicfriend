import React, { useEffect, useState } from "react";
import { getUserSpotifyInfo } from "../DataManagers/SpotifyManager";
import UserItem from "../components/UserItem";
import Form from "../components/Form";
import { useSelector } from "react-redux";
import { getUserTracks } from "../DataManagers/FirebaseManager";
import "../Styles/Home.css";
import { getMatchesTracks } from "../DataManagers/Util";

function Home() {
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
  }, []);

  const handleFormSubmit = (otherUserEmail) => {
    getMatchesTracks(user.email, otherUserEmail).then((result) => {
      setMatchesInfo(result);
      setSearched(true);
    });
  };

  const handleSearch = (otherUserEmail) => {
    getMatchesTracks(user.email, otherUserEmail).then((result) => {
      setMatchesInfo(result);
      setSearched(true);
    });
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
        <button onClick={handleSearchAgain}>Search Again</button>
      </div>
    );
  };

  return (
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
  );
}

export default Home;
