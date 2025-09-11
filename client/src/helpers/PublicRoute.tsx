import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./authHelper";

const PublicRoute = ({ children }: any) => {
  const user = isLoggedIn();

  // If user is logged in, redirect to dashboard
  if (user && user.token) {
    return <Navigate to="/" replace />;
  }

  // If user is not logged in, show the public page (login/signup)
  return children;
};

export default PublicRoute;
