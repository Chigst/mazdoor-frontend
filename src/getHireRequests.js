import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "./firebaseConfig";

const db = getFirestore(firebaseApp);

const getHireRequests = async () => {
  const snapshot = await getDocs(collection(db, "hire_requests"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export default getHireRequests;
