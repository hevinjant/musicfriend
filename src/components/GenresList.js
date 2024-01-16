import React from "react";

function GenresList({ genres }) {
  return (
    <div
      className="genres-grid"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
    >
      {genres.map((genre, idx) => {
        return (
          <p
            key={idx}
            style={{
              textAlign: "center",
              backgroundColor: "#1db954",
              borderRadius: "5px",
              width: "auto",
              padding: "5px 15px 5px 15px",
              fontSize: "12px",
              fontWeight: "700",
              margin: "5px",
            }}
          >
            {genre}
          </p>
        );
      })}
    </div>
  );
}

export default GenresList;
