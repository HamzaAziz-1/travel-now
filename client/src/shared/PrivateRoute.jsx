/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../context/AuthContext";

const PrivateRoute = ({ children, roles }) => {
  const { user } = useGlobalContext();

  // If there's no user, redirect to the login page
  if (!user) {
    return <Navigate to="/" />;
  }

  // Check if the user's role is included in the allowed roles
  if (!roles.includes(user.role)) {
    // Redirect to a forbidden or access-denied page
    return <Navigate to="/" />;
  }

  // Allow access to the route for authorized users
  return children;
};

export default PrivateRoute;
