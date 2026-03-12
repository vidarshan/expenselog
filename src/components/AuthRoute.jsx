import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.user?.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthRoute;
