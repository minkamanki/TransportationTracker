import React from "react";
import { Route, useNavigate } from "react-router-dom";
import AuthService from "./services/authService.js";

const AuthRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = AuthService.getCurrentUser();
  const navigate = useNavigate(); // Get the navigate function

  if (!isAuthenticated) {
    // If not authenticated, navigate to the login page
    navigate("/login");
  }

  return <Route {...rest} element={<Component />} />;
};

export default AuthRoute;
