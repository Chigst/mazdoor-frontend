// src/getContractors.js

import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig"; // ✅ Make sure this path is correct

const getContractors = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "contractors"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("✅ Contractors fetched:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching contractors:", error);
    return [];
  }
};

export default getContractors;
