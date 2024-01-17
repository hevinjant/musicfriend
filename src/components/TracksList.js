import React from "react";
import SongItem from "./SongItem";
import "../styles/TracksList.css";

function TracksList({ tracks }) {
  return (
    <div className="tracks-list">
      {tracks.map((track, key) => {
        return <SongItem key={key} track={track} />;
      })}
    </div>
  );
}

export default TracksList;
