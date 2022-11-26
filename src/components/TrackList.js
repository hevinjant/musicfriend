import React from "react";
import SongItem from "./SongItem";

const TrackList = ({ tracks }) => {
  console.log("TrackList:", tracks);
  return (
    <div className="track-list">
      {tracks.map((track) => {
        return (
          <button>
            <SongItem track={track} />
          </button>
        );
      })}
    </div>
  );
};

export default TrackList;
