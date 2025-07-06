import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD123ABC...",
  authDomain: "mazdoor-app.firebaseapp.com",
  projectId: "mazdoor-acc88",
  storageBucket: "mazdoor-app.appspot.com",
  messagingSenderId: "109123456789",
  appId: "1:109123456789:web:abc123def456"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
