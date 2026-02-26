import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.user);
  console.log("token", token);

  if (!token) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
