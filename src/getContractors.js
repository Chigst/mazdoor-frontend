import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const getContractors = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "contractors"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Contractors fetched:", data); // ✅ Add this line
    return data;
  } catch (error) {
    console.error("Error fetching contractors:", error); // ✅ Add this
    return [];
  }
};

export default getContractors;
