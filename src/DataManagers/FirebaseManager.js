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
if not then insert new user information to database */
export async function insertUserToDatabase(userInfo, userTracks) {
  const userEmail = userInfo.email;
  const docRef = doc(database, "users", userEmail);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("insertUserToDatabase(): User exists.");
    // update user's tracks
    await setDoc(docRef, { tracks: userTracks }, { merge: true });
  } else {
    // insert new user
    const userData = {
      display_name: userInfo.displayName,
      display_picture_url: userInfo.userImageUrl,
      tracks: userTracks,
      match_history: [],
    };
    await setDoc(docRef, userData);
  }
}

/* 
Insert user tracks information to database.
Always insert tracks for log in user (including existing users),
to always have their tracks up to date. 
*/
export async function insertTracksForUser(userEmail) {}

/* Get all tracks from user */
export async function getUserTracks(userEmail) {}

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
