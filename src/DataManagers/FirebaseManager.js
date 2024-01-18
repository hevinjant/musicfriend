import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { database } from "../Firebase";

/* Check if user exists in database, 
if not then insert new user information and their tracks to database.
if user exists then just update their tracks.
*/
export async function insertUserToDatabase(userInfo, tracks, genres) {
  console.log("Inserting user to database...");

  const userId = userInfo.id;
  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);

  // only insert top 20 genres
  const top = 12;
  let topGenres = [];
  for (let i = 0; i < genres.length; i++) {
    if (i == top) {
      break;
    }
    topGenres.push(genres[i]);
  }

  if (docSnap.exists()) {
    console.log("insertUserToDatabase(): User exists.");
    // if user already exists, update user's info cause they may have changed
    const userData = {
      id: userInfo.id,
      tracks: tracks.allTracks,
      topTracks: tracks.topTracks,
      genres: topGenres,
      email: userInfo.email,
      display_name: userInfo.display_name,
      display_picture_url: userInfo.display_picture_url,
      country: userInfo.country,
      long: userInfo.long,
      lat: userInfo.lat,
    };
    console.log("User Data (Existing):", userData);
    await setDoc(docRef, userData, { merge: true });
  } else {
    // insert new user and their tracks
    const userData = {
      id: userInfo.id,
      email: userInfo.email,
      display_name: userInfo.display_name,
      display_picture_url: userInfo.display_picture_url,
      tracks: tracks.allTracks,
      topTracks: tracks.topTracks,
      genres: topGenres,
      match_history: [],
      country: userInfo.country,
      favorite_track: null,
      long: userInfo.long === undefined ? null : userInfo.long,
      lat: userInfo.lat === undefined ? null : userInfo.lat,
    };
    console.log("User Data (New):", userData);
    await setDoc(docRef, userData);
  }
}

export async function changeUserProfilePicture(userInfo, newImageUrl) {
  const userId = userInfo.id;
  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, {
      display_picture_url: newImageUrl,
    });
  } else {
    console.log("changeUserProfilePicture(): User doesn't exist.");
  }
}

export async function updateUserFavoriteSong(userId, favoriteTrack) {
  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, {
      favorite_track: favoriteTrack,
    });
  } else {
    console.log("updateUserFavoriteSong(): User doesn't exist.");
  }
}

export async function getUserFavoriteSong(userId) {
  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const favoriteSong = docSnap.data().favorite_track;
    return favoriteSong;
  }
  return null;
}

/* Get user genres from database */
export async function getUserGenres(userId) {
  if (!userId) {
    return [];
  }

  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const genres = docSnap.data().genres;
    if (!genres) {
      return [];
    }
    return genres;
  }
}

/* Get all user's tracks from database */
export async function getUserTracks(userId) {
  if (!userId) {
    return [];
  }

  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const tracks = docSnap.data().tracks;
    if (!tracks) {
      return [];
    }
    return tracks;
  }
  return [];
}

/* Get all user's top tracks from database */
export async function getUserTopTracks(userId) {
  if (!userId) {
    return [];
  }

  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const topTracks = docSnap.data().topTracks;
    if (!topTracks) {
      return [];
    }
    return topTracks;
  }
  return [];
}

/* Get user's match history */
export async function getUserMatchHistory(userId) {
  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const tracks = docSnap.data().match_history;
    return tracks;
  }
  return [];
}

/* Find the corresponding user id for given user display name */
export async function getUserIdByDisplayName(displayName) {
  // get all documents under 'users'
  const querySnapshot = await getDocs(collection(database, "users"));
  let result = [];
  // iterate through all the documents
  querySnapshot.forEach((doc) => {
    // check if the doc's display_name equal to displayName
    const currentDocName = doc.data().display_name.toLowerCase();
    if (currentDocName === displayName.toLowerCase()) {
      // get the doc's id
      result.push(doc.id);
    } else if (currentDocName.startsWith(displayName.toLowerCase())) {
      // get the doc's id
      result.push(doc.id);
    }
  });
  return result;
}

/* Get user information from database */
export async function getUserInfo(userId) {
  if (!userId) {
    return {};
  }

  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const docData = docSnap.data();
    const user = {
      id: docData.id,
      display_name: docData.display_name,
      email: docData.email,
      display_picture_url: docData.display_picture_url,
    };

    return user;
  }

  return {};
}

/* Search user by display name from database */
export async function getUserByName(displayName) {}

/* Insert match result to database */
export async function insertMatchResultToDatabase(userId, matchResult) {
  const matchHistory = {
    tracksPercentage: matchResult.tracksPercentage,
    similarTracks: matchResult.similarTracks,
    topTracksPercentage: matchResult.topTracksPercentage,
    similarTopTracks: matchResult.similarTopTracks,
    genresPercentage: matchResult.genresPercentage,
    similarGenres: matchResult.similarGenres,
    otherUserInfo: matchResult.otherUserInfo,
    timestamp: matchResult.timestamp,
  };
  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, {
      match_history: arrayUnion(matchHistory),
    });
  } else {
    console.log("insertMatchResultToDatabase(): User doesn't exist.");
  }
}

/* Get all users from the database */
export async function getAllUsersFromDatabase() {
  // get all documents under 'users'
  const querySnapshot = await getDocs(collection(database, "users"));
  let result = [];
  // iterate through all the documents
  querySnapshot.forEach((doc) => {
    result.push(doc.data());
  });
  return result;
}

export async function insertTracksForUser(userid, tracks) {
  console.log("Inserting user tracks to database...");
}

/* Database scheme for user

Users:
    user-id:
        email
        country
        user-display-name
        user-picture-url
        tracks
            trackArtists
            trackArtistsId
            trackId
            trackImageUrl
            trackLink
            trackName
            trackPreviewUrl
            trackGenres
        user-match-history
            other-user-email
                match-percentage
                common-genres

*/
