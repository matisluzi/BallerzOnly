import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "./AuthService";

function ProtectedRoute({ children }) {
  if (!AuthService.isLoggedIn()) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" replace />;
  }

  return children;
}

export { ProtectedRoute };
