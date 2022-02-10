import axios from "axios";

export const SPOTIFY_CLIENT_ID = "4cb59fcbc79e4bbcb51d908f87698410";

const GET_USER_SPOTIFY_PROFILE_ENDPOINT = "https://api.spotify.com/v1/me";
const GET_CURRENT_USER_PLAYLIST_ENDPOINT =
  "https://api.spotify.com/v1/me/playlists";
const GET_PLAYLIST_ITEMS_ENDPOINT =
  "https://api.spotify.com/v1/playlists/{playlist_id}/tracks";
const GET_ARTIST_ENDPOINT = "https://api.spotify.com/v1/artists/"; // + {id}

// Get user's Spotify account personal information
export async function getUserSpotifyInfo(token) {
  try {
    const response = await axios.get(GET_USER_SPOTIFY_PROFILE_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = response.data;
    const user = {
      displayName: result["display_name"],
      email: result["email"],
      userImageUrl: result["images"][0]["url"],
    };
    return user;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Get all user playlists
export async function getUserPlaylists(token) {}
