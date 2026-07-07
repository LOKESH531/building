import { initializeApp, deleteApp } from "firebase/app";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  getAuth,
} from "firebase/auth";

import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

import { auth, db, firebaseConfig } from "../firebase/firebaseConfig";
import generateCompanyId from "../utils/generateCompanyId";
import { ROLES } from "../constants/roles";

/* ===========================
   ERROR MESSAGES
=========================== */

export const getAuthError = (code) => {
  switch (code) {
    case "auth/user-not-found":       return "Account doesn't exist.";
    case "auth/wrong-password":       return "Incorrect password.";
    case "auth/email-already-in-use": return "Email already exists.";
    case "auth/weak-password":        return "Password too weak. Use at least 6 characters.";
    case "auth/invalid-email":        return "Invalid email.";
    case "auth/invalid-credential":   return "Incorrect email or password.";
    case "auth/too-many-requests":    return "Too many login attempts. Please try again later.";
    default:                          return "Something went wrong. Please try again.";
  }
};

/* ===========================
   LOGIN
=========================== */

export const login = async (email, password, remember = false) => {
  await setPersistence(
    auth,
    remember ? browserLocalPersistence : browserSessionPersistence
  );

  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);

  // Email verification disabled
  // if (!credential.user.emailVerified) {
  //   await signOut(auth);
  //   throw new Error("Please verify your email before logging in.");
  // }

  const snap = await getDoc(doc(db, "users", credential.user.uid));

  if (!snap.exists()) {
    await signOut(auth);
    throw new Error("Account profile not found. Please contact the owner.");
  }

  const userData = snap.data();

  if (userData.status !== "active") {
    await signOut(auth);
    throw new Error("Your account is inactive. Please contact the owner.");
  }

  return { role: userData.role, user: userData };
};

/* ===========================
   LOGOUT
=========================== */

export const logout = async () => {
  await signOut(auth);
};

/* ===========================
   FORGOT PASSWORD
=========================== */

export const forgotPassword = async (email) => {
  return sendPasswordResetEmail(auth, email.trim());
};

/* ===========================
   REGISTER OWNER
=========================== */

export const registerOwner = async (data) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    data.email.trim(),
    data.password
  );

  const uid = credential.user.uid;
  const companyId = generateCompanyId();

  await updateProfile(credential.user, { displayName: data.ownerName.trim() });

  await setDoc(doc(db, "companies", companyId), {
    companyId,
    companyName: data.companyName.trim(),
    ownerId: uid,
    phone: data.phone.trim(),
    email: data.email.trim(),
    address: data.address.trim(),
    logo: "",
    status: "active",
    createdAt: serverTimestamp(),
  });

  await setDoc(doc(db, "users", uid), {
    uid,
    companyId,
    role: ROLES.OWNER,
    name: data.ownerName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    profileImage: "",
    status: "active",
    createdAt: serverTimestamp(),
  });

  await signOut(auth);

  return credential.user;
};

/* ===========================
   CREATE USER (admin or client)
   Uses secondary Firebase app so owner stays logged in.
=========================== */

export const createUser = async (data) => {
  const secondaryApp = initializeApp(
    firebaseConfig,
    `secondary-${Date.now()}-${Math.random()}`
  );
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const credential = await createUserWithEmailAndPassword(
      secondaryAuth,
      data.email.trim(),
      data.password
    );

    await updateProfile(credential.user, { displayName: data.name.trim() });

    await setDoc(doc(db, "users", credential.user.uid), {
      uid: credential.user.uid,
      companyId: data.companyId,
      role: data.role,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      profileImage: "",
      assignedProjects: [],
      status: "active",
      createdAt: serverTimestamp(),
    });

    await signOut(secondaryAuth);

    return credential.user;
  } finally {
    await deleteApp(secondaryApp);
  }
};

/* ===========================
   GET CURRENT USER
=========================== */

export const getCurrentUser = () => {
  return auth.currentUser;
};
