import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./authHelper";

const PrivateRoute = ({ children }: any) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
