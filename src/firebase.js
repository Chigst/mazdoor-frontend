import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD123ABC...",  // your actual API key here
  authDomain: "mazdoor-app.firebaseapp.com",
  projectId: "mazdoor-acc88",
  storageBucket: "mazdoor-app.appspot.com",
  messagingSenderId: "109123456789",
  appId: "1:109123456789:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);  // Initialize Firebase Auth

export { db, auth };  // Export both db and auth
