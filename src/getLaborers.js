import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const getLaborers = async () => {
  const laborersRef = collection(db, "laborers");
  const snapshot = await getDocs(laborersRef);
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return data;
};

export default getLaborers;
