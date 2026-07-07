import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

export const getUsers = async (companyId) => {
  const q = query(
    collection(db, "users"),
    where("companyId", "==", companyId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateUser = async (id, data) => {
  await updateDoc(doc(db, "users", id), data);
};

export const deleteUser = async (id) => {
  await deleteDoc(doc(db, "users", id));
};
