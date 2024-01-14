import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
export const database = getFirestore(app);