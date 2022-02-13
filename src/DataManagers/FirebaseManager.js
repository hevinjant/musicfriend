import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

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
  const userEmail = userInfo.email;
  const docRef = doc(database, "users", userEmail);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("insertUserToDatabase(): User exists.");
    // if user already exists, just update user's tracks
    await setDoc(docRef, { tracks: userTracks }, { merge: true });
  } else {
    // insert new user and their tracks
    const userData = {
      display_name: userInfo.displayName,
      display_picture_url: userInfo.userImageUrl,
      tracks: userTracks,
      match_history: [],
    };
    await setDoc(docRef, userData);
  }
}

/* Get all user's tracks from database */
export async function getUserTracks(userEmail) {
  const docRef = doc(database, "users", userEmail);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const tracks = docSnap.data().tracks;
    return tracks;
  }
  return [];
}

/* Database scheme for user

Users:
    user-email:
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
