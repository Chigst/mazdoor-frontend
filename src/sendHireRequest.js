import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

const sendHireRequest = async (laborerId, contractorId) => {
  try {
    await addDoc(collection(db, "hires"), {
      laborerId,
      contractorId,
      status: "pending",
      requestedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error sending hire request:", error);
  }
};

export default sendHireRequest;
