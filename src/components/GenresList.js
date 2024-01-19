import React from "react";

function GenresList({ genres }) {
  return (
    <div
      className="genres-grid"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "0px 20px 0px 20px" }}
    >
      {genres.map((genre, idx) => {
        return (
          <p
            key={idx}
            style={{
              textAlign: "center",
              backgroundColor: "var(--light-purple)",
              borderRadius: "5px",
              width: "auto",
              padding: "5px 15px 5px 15px",
              fontSize: "12px",
              color: "var(--lightest-gray)",
              fontWeight: "700",
              margin: "5px",
              letterSpacing: "0.5px"
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
