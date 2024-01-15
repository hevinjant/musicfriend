import axios from "axios";

const SPOTIFY_CLIENT_ID = "4cb59fcbc79e4bbcb51d908f87698410";
const SPOTIFY_AUTHORIZATION_URL = "https://accounts.spotify.com/authorize";
const REDIRECT_URI = "http://localhost:3000";
const scopes = ["user-read-private", "user-read-email", "user-read-currently-playing", "user-library-read", "playlist-read-private", "user-top-read"];
export const SPOTIFY_AUTHORIZATION_URL_PARAMETERS = `${SPOTIFY_AUTHORIZATION_URL}?response_type=token&client_id=${SPOTIFY_CLIENT_ID}&scope=${scopes.join("%20")}&show_dialog=true&redirect_uri=${REDIRECT_URI}`;

const GET_USER_SPOTIFY_PROFILE_ENDPOINT = "https://api.spotify.com/v1/me";
const GET_CURRENT_USER_PLAYLIST_ENDPOINT =
  "https://api.spotify.com/v1/me/playlists";
const GET_PLAYLIST_ITEMS_ENDPOINT = "https://api.spotify.com/v1/playlists/"; // + {playlist_id}/tracks
const GET_ARTIST_ENDPOINT = "https://api.spotify.com/v1/artists/"; // + {id}
const GET_SONGS_ENDPOINT = "https://api.spotify.com/v1/search"; // ex. https://api.spotify.com/v1/search?q=ride%20or%20die
const GET_TOP_ARTISTS = "https://api.spotify.com/v1/me/top/artists"

/* Check if access token is expired (more than an hour) */
export function accessTokenIsValid(token, timestamp) {
  const oneHour = 60 * 60 * 1000; /* ms */
  //const threeMinutes = 180 * 1000;
  return token !== "" && Date.now() - timestamp < oneHour;
}

/* Get user's Spotify account information, access token is required */
export async function getUserSpotifyInfo(token) {
  console.log("Getting user Spotify info...");
  try {
    const response = await axios.get(GET_USER_SPOTIFY_PROFILE_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = response.data;
    const user = {
      display_name: result["display_name"],
      email: result["email"],
      display_picture_url: result["images"][0]["url"],
      id: result["id"],
      country: result["country"],
    };
    return user;
  } catch (error) {
    console.log("getUserSpotifyInfo:", error);
    return false;
  }
}

/* Get all playlists from user's Spotify account, access token is required */
export async function getUserSpotifyPlaylists(token, userId) {
  console.log("Getting user Spotify playlists...");
  try {
    let playlists = [];
    const limit = 50;

    for (let offset = 0; offset < 10000; offset += limit) {
      const endpoint = `${GET_CURRENT_USER_PLAYLIST_ENDPOINT}?limit=${limit}&offset=${offset}`;
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = response.data["items"];
      if (result.length === 0) {
        break;
      }
      playlists = playlists.concat(result);
    }
    const playlistCreatedByCurrentUser = playlists.filter(
      (playlist) => playlist.owner.id === userId
    );
    const playlistIDs = playlistCreatedByCurrentUser.map((playlist) => {
      return playlist["id"];
    });
    console.log("Playlists:", playlistIDs[0]);
    return playlistIDs;
  } catch (error) {
    console.log("getUserPlaylists():", error);
    return false;
  }
}

/* Get all tracks from user's Spotify playlists by playlist id, access token is required */
export async function getUserSpotifyTracks(token, playlistsID) {
  console.log("Getting user Spotify tracks...");
  try {
    let tracks = [];
    const limit = 100; // Spotify let app to retrieve 100 tracks at once

    // iterate through all the playlists
    for (const id of playlistsID) {
      // for each playlist, get 100 tracks per offset until we get all of the tracks
      for (let offset = 0; offset < 10000; offset += limit) {
        const endpoint = `${GET_PLAYLIST_ITEMS_ENDPOINT}${id}/tracks??limit=${limit}&offset=${offset}`;
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = response["data"]["items"];
        // if no more result is returned with the current offset, exit the loop
        if (result.length === 0) {
          break;
        }
        tracks = tracks.concat(result);
      }
    }
    console.log("Tracks: ", tracks);
    // remove duplicates track (because user may have same tracks in different playlists)
    const tracksWithoutDuplicates = tracks.filter(
      (track, index, self) =>
        index ===
        self.findIndex(
          (target) =>
            target["track"]["id"] === track["track"]["id"] &&
            target["track"]["name"] === track["track"]["name"]
        )
    );

    const parsedTracks = parseSpotifyTracks(tracksWithoutDuplicates);
    return parsedTracks;
  } catch (error) {
    console.log("getUserTracks():", error);
    return false;
  }
}

/* Map each Spotify JSON track to only store the data we need */
function parseSpotifyTracks(tracksJSON) {
  const tracks = tracksJSON.map((track) => {
    return parseSpotifyTrack(track["track"]);
  });
  return tracks;
}

export function parseSpotifyTrack(track) {
  const trackArtists = track["artists"];
  let artistNames = "";
  let artistsId = [];
  for (const artist of trackArtists) {
    artistNames += artist["name"] + ", ";
    artistsId.push(artist["id"]);
  }
  artistNames = artistNames.slice(0, -2); // get rid of the last comma and space

  const parsed = {
    trackId: track["id"],
    trackName: track["name"],
    trackArtists: artistNames,
    trackArtistsId: artistsId,
    trackImageUrl:
      track["album"]["images"].length > 0
        ? track["album"]["images"][0]["url"]
        : null,
    trackLink: track["external_urls"]["spotify"],
    trackPreviewUrl: track["preview_url"],
    trackGenres: null,
  };

  return parsed;
}

/* Get a track based on user's query */
export async function getSongs(token, trackQuery) {
  // For this app, params' type should always be "track".
  const params = {
    q: trackQuery,
    type: "track", // track or artist
  };
  const searchQuery = "?" + new URLSearchParams(params).toString();
  const url = GET_SONGS_ENDPOINT + searchQuery;
  let results = [];
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    results = response["data"]["tracks"]["items"];
    const tracks = results.map((track) => parseSpotifyTrack(track));

    return tracks;
  } catch (error) {
    console.log("getSongs():", error);
    return false;
  }
}

/* Get artist information from a given artist Id */
export async function getArtist(token, artistId) {
  const url = GET_ARTIST_ENDPOINT + artistId;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const results = response["data"];
    return results;
  } catch (error) {
    console.log("getArtist():", error);
    return false;
  }
}

/* Get user genres based on all user's tracks */
export async function getUserTopGenres(token) {
  console.log("Getting user Spotify genres...");
  let genres = [];
  const url = GET_TOP_ARTISTS + "?limit=10";

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const topArtists = response["data"]["items"];

    for (const artist of topArtists) {
      if (artist.genres) {
        (artist.genres).forEach(genre => genres.push(genre))
      }
    }
    return genres;
  } catch (error) {
    console.log("getUserTopGenres(): ", error);
    return false;
  }
}
