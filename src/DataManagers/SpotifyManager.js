import axios from "axios";
import { Scopes } from "react-spotify-auth";

export const SPOTIFY_CLIENT_ID = "4cb59fcbc79e4bbcb51d908f87698410";

const GET_USER_SPOTIFY_PROFILE_ENDPOINT = "https://api.spotify.com/v1/me";
const GET_CURRENT_USER_PLAYLIST_ENDPOINT =
  "https://api.spotify.com/v1/me/playlists";
const GET_PLAYLIST_ITEMS_ENDPOINT = "https://api.spotify.com/v1/playlists/"; // + {playlist_id}/tracks
const GET_ARTIST_ENDPOINT = "https://api.spotify.com/v1/artists/"; // + {id}

export const OAUTH_SCOPES = [
  Scopes.userReadPrivate,
  Scopes.userReadEmail,
  Scopes.userReadCurrentlyPlaying,
  Scopes.userLibraryRead,
  Scopes.playlistReadPrivate,
];

/* Get user's Spotify account information, access token is required */
export async function getUserSpotifyInfo(token) {
  try {
    const response = await axios.get(GET_USER_SPOTIFY_PROFILE_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = response.data;
    const user = {
      displayName: result["display_name"],
      email: result["email"],
      imageUrl: result["images"][0]["url"],
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
export async function getUserSpotifyPlaylists(token) {
  try {
    const response = await axios.get(GET_CURRENT_USER_PLAYLIST_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = response.data["items"];
    const playlistsID = result.map((playlist) => {
      return playlist["id"];
    });
    return playlistsID;
  } catch (error) {
    console.log("getUserPlaylists():", error);
    return false;
  }
}

/* Get all tracks from user's Spotify playlists by playlist id, access token is required */
export async function getUserSpotifyTracks(token, playlistsID) {
  try {
    let tracks = [];
    const limit = 100; // Spotify let app to retrieve 100 tracks at once

    // iterate through all the playlists
    for (const id of playlistsID) {
      // for each playlist, get 100 tracks per offset until we get all of the tracks
      for (let offset = 0; offset < 500; offset += 100) {
        let result = [];
        const endpoint = `${GET_PLAYLIST_ITEMS_ENDPOINT}${id}/tracks??limit=${limit}&offset=${offset}`;
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        result = response["data"]["items"];
        tracks = tracks.concat(result);
        // if no more result is returned with the current offset, exit the loop
        if (result.length === 0) {
          break;
        }
      }
    }
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

    return parseSpotifyTracks(tracksWithoutDuplicates);
  } catch (error) {
    console.log("getUserTracks():", error);
    return false;
  }
}

/* Map each Spotify JSON track to only store the data we need */
function parseSpotifyTracks(tracksJSON) {
  const tracks = tracksJSON.map((track) => {
    // get all the names and id of the artists
    const trackArtists = track["track"]["artists"];
    let artistNames = "";
    let artistsId = [];
    for (const artist of trackArtists) {
      artistNames += artist["name"] + ", ";
      artistsId.push(artist["id"]);
    }
    artistNames = artistNames.slice(0, -2); // get rid of the last comma and space

    const parsed = {
      trackId: track["track"]["id"],
      trackName: track["track"]["name"],
      trackArtists: artistNames,
      trackArtistsId: artistsId,
      trackImageUrl: track["track"]["album"]["images"][0]["url"],
      trackLink: track["track"]["external_urls"]["spotify"],
      trackPreviewUrl: track["track"]["preview_url"],
      trackGenres: null,
    };

    return parsed;
  });

  return tracks;
}
