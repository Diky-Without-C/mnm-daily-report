import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "./firebase";

export function useFirestoreCrud<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colRef = collection(db, collectionName);

  const fetchData = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(colRef);
      const result = snapshot.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...(doc.data() as T),
        }),
      ) as T[];
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const create = async (item: Omit<T, "id">) => {
    const docRef = await addDoc(colRef, item);
    await fetchData();
    return docRef.id;
  };

  const update = async (id: string, updatedData: Partial<T>) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, updatedData);
    await fetchData();
  };

  const remove = async (id: string) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [collectionName]);

  return { data, loading, error, create, update, remove, refetch: fetchData };
}
