import React from 'react';
import "../styles/ArtistItem.css";

function ArtistItem({artist}) {
  return (
    <div className="artist-item">
      <a href={artist.artistExternalUrl} target="_blank">
        <img className="artist-img" src={artist.artistImageUrl} alt="no image" />
      </a>
      <p className="artist-name">{artist.artistName}</p>
    </div>
  )
}

export default ArtistItem