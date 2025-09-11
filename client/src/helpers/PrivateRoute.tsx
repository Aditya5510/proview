import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./authHelper";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = isLoggedIn();
    return !!(user && user.token);
  });

  useEffect(() => {
    const handleAuthChange = () => {
      const user = isLoggedIn();
      const authenticated = !!(user && user.token);
      setIsAuthenticated(authenticated);
    };

    // Listen for authentication changes
    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // Check if user exists and has required properties
  if (isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
