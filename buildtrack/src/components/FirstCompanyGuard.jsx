import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";

function FirstCompanyGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [companyExists, setCompanyExists] = useState(false);

  useEffect(() => { checkCompany(); }, []);

  async function checkCompany() {
    try {
      const snapshot = await getDocs(collection(db, "companies"));
      setCompanyExists(!snapshot.empty);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="auth-loading">Checking company...</div>;
  }

  if (companyExists) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default FirstCompanyGuard;
