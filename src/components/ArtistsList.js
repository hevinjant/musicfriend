import React from "react";
import ArtistItem from "./ArtistItem";
import "../styles/ArtistsList.css";

function ArtistsList({ artists }) {
  return (
    <div className="artists-list">
      {artists.map((artist, key) => {
        return <ArtistItem key={key} artist={artist} />;
      })}
    </div>
  );
}

export default ArtistsList;
