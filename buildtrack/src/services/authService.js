import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";

import { auth, db } from "../firebase/firebaseConfig";

/* ===========================
   ERROR MESSAGES
=========================== */

export const getAuthError = (code) => {
  switch (code) {
    case "auth/user-not-found":     return "Account doesn't exist.";
    case "auth/wrong-password":     return "Incorrect password.";
    case "auth/email-already-in-use": return "Email already exists.";
    case "auth/weak-password":      return "Password too weak.";
    case "auth/invalid-email":      return "Invalid email.";
    case "auth/invalid-credential": return "Incorrect email or password.";
    default:                        return "Something went wrong. Please try again.";
  }
};

/* ===========================
   LOGIN
=========================== */

export const loginUser = async (email, password, remember = false) => {
  await setPersistence(
    auth,
    remember ? browserLocalPersistence : browserSessionPersistence
  );

  const credential = await signInWithEmailAndPassword(auth, email, password);

  if (!credential.user.emailVerified) {
    throw new Error("Please verify your email before logging in.");
  }

  const uid = credential.user.uid;

  const adminSnap = await getDoc(doc(db, "admins", uid));
  if (adminSnap.exists()) {
    return { role: "admin", user: adminSnap.data() };
  }

  const clientSnap = await getDoc(doc(db, "clients", uid));
  if (clientSnap.exists()) {
    return { role: "client", user: clientSnap.data() };
  }

  throw new Error("Account not found.");
};

/* ===========================
   ADMIN SIGNUP
=========================== */

export const registerAdmin = async (data) => {
  const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);

  await updateProfile(credential.user, { displayName: data.name });

  await sendEmailVerification(credential.user);

  await setDoc(doc(db, "admins", credential.user.uid), {
    uid: credential.user.uid,
    name: data.name,
    companyName: data.companyName,
    phone: data.phone,
    email: data.email,
    address: data.address,
    gst: data.gst,
    role: "admin",
    status: "active",
    createdAt: serverTimestamp(),
  });

  return credential.user;
};

/* ===========================
   CLIENT SIGNUP
=========================== */

export const registerClient = async (data) => {
  const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);

  await updateProfile(credential.user, { displayName: data.name });

  await sendEmailVerification(credential.user);

  await setDoc(doc(db, "clients", credential.user.uid), {
    uid: credential.user.uid,
    name: data.name,
    phone: data.phone,
    email: data.email,
    assignedProjects: [],
    role: "client",
    status: "active",
    createdAt: serverTimestamp(),
  });

  return credential.user;
};

/* ===========================
   RESET PASSWORD
=========================== */

export const resetPassword = async (email) => {
  return sendPasswordResetEmail(auth, email);
};

/* ===========================
   LOGOUT
=========================== */

export const logoutUser = async () => {
  await signOut(auth);
};
