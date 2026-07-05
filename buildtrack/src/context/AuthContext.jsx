import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      setCurrentUser(user);

      const adminDoc = await getDoc(doc(db, "admins", user.uid));
      if (adminDoc.exists()) {
        setRole("admin");
        setLoading(false);
        return;
      }

      const clientDoc = await getDoc(doc(db, "clients", user.uid));
      if (clientDoc.exists()) {
        setRole("client");
        setLoading(false);
        return;
      }

      setRole(null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
