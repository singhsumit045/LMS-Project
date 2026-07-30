import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({
  children,
  allowedRoles = [],
}) => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/courses" replace />;
  }

  return children;
};

export default RoleProtectedRoute;