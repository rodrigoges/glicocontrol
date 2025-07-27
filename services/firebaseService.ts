import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { Measurement } from "../types";

export const saveMeasurement = async (userId: string, measurement: Measurement) => {
  await addDoc(collection(db, "measurements"), {
    ...measurement,
    userId,
    // Garante que a data seja salva como timestamp do Firestore
    date: measurement.date ? Timestamp.fromDate(new Date(measurement.date)) : Timestamp.now(),
  });
};

export const getMeasurements = async (userId: string): Promise<Measurement[]> => {
  const q = query(collection(db, "measurements"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      // Converte o timestamp do Firestore para string ISO
      date: data.date?.toDate ? data.date.toDate().toISOString() : data.date,
    } as Measurement;
  });
}; 