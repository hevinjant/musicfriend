import React from 'react'

function ArtistItem({artist}) {
  return (
    <div className="artist-item">
      <img className="artist-img" src={artist.artistImageUrl} alt="no image" />
      <p className="artist-name">{artist.artistName}</p>
    </div>
  )
}

export default ArtistItem