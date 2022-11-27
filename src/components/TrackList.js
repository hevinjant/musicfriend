import React from "react";
import SongItem from "./SongItem";
import "../styles/TrackList.css";

const TrackList = ({ tracks, handleUpdateFavoriteTrack }) => {
  // const changeProfilePicture = (newImageUrl) => {
  //   handleChangeProfilePicture(newImageUrl);
  // };

  const updateFavoriteTrack = (track) => {
    handleUpdateFavoriteTrack(track);
  };

  return (
    <div className="track-list">
      {tracks.map((track) => {
        return (
          <button
            className="track-list-item"
            key={track.trackId}
            onClick={() => {
              updateFavoriteTrack(track);
            }}
          >
            <SongItem track={track} />
          </button>
        );
      })}
    </div>
  );
};

export default TrackList;
