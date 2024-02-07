import React from "react";
import UserItem from "../components/UserItem";
import GenresList from "../components/GenresList";
import TracksList from "../components/TracksList";

function MatchResult() {
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
        <hr style={{ borderColor: "#3d3d3d" }} />
        <div className="top-tracks-match">
          <p className="match-percentage">
            Your top listened songs match{" "}
            <strong>{matchesInfo.topTracksPercentage}%</strong>
          </p>
          <p className="match-total">
            {matchesInfo.similarTopTracks.length} total match top listened
            song(s)
          </p>
          <div className="track-list" style={{ marginBottom: "100px" }}>
            <TracksList tracks={matchesInfo.similarTopTracks} />
          </div>
        </div>
        <hr style={{ borderColor: "#3d3d3d" }} />
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
}

export default MatchResult;
