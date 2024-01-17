import React from "react";
import "../styles/SongItem.css";

function SongItem({ track }) {
  return (
    <div className="song-item">
      <img className="track-img" src={track.trackImageUrl} alt="no image" />
      <p className="track-name">{track.trackName}</p>
      <p className="track-artists">{track.trackArtists}</p>
    </div>
  );
}

export default SongItem;
