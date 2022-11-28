import { initializeApp } from "firebase/app";
import {
  doc,
  getDoc,
  updateDoc,
  getFirestore,
  setDoc,
  collection,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { parseSpotifyTrack } from "./SpotifyManager";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnoUJPCrhshTd7UT7CSodMv0ILIQudn_I",
  authDomain: "musicfriend-c549b.firebaseapp.com",
  projectId: "musicfriend-c549b",
  storageBucket: "musicfriend-c549b.appspot.com",
  messagingSenderId: "350517233861",
  appId: "1:350517233861:web:8bb840e25022be42f248ac",
  measurementId: "G-9E82HZ4G59",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

/* Check if user exists in database, 
if not then insert new user information and their tracks to database.
if user exists then just update their tracks.
*/
export async function insertUserToDatabase(userInfo, userTracks) {
  const userId = userInfo.id;
  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("insertUserToDatabase(): User exists.");
    // if user already exists, update user's info cause they may have changed
    await setDoc(
      docRef,
      {
        tracks: userTracks,
        email: userInfo.email,
        display_name: userInfo.displayName,
        display_picture_url: userInfo.imageUrl,
        country: userInfo.country,
      },
      { merge: true }
    );
  } else {
    // insert new user and their tracks
    const userData = {
      email: userInfo.email,
      display_name: userInfo.displayName,
      display_picture_url: userInfo.imageUrl,
      tracks: userTracks,
      match_history: [],
      country: userInfo.country,
      favorite_track: null,
    };
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

export async function updateUserFavoriteSong(userInfo, favoriteTrack) {
  const userId = userInfo.id;
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

/* Get all user's tracks from database */
export async function getUserTracks(userId) {
  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const tracks = docSnap.data().tracks;
    return tracks;
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
  const docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const docData = docSnap.data();
    const user = {
      displayName: docData.display_name,
      imageUrl: docData.display_picture_url,
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
    percentage: matchResult.percentage,
    otherUserInfo: matchResult.otherUserInfo,
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
