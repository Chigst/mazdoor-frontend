// src/firebaseConfig.js

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBuYmAw-dztTVMr37bCuLDGesToZC-ZyOs",
  authDomain: "mazdoor-acc88.firebaseapp.com",
  projectId: "mazdoor-acc88",
  storageBucket: "mazdoor-acc88.appspot.com",
  messagingSenderId: "333489311293",
  appId: "1:333489311293:web:de561765e79929852ba454",
  measurementId: "G-Q1PYR2NXHT"
};

// ✅ Initialize Firebase once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Services
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

console.log("✅ Firebase Initialized");

export { app, auth, db, provider };

