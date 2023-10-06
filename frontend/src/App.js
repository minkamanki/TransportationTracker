import React from "react";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom"; // Import the Route component
import AuthRoute from "./AuthRoute"; // Import the AuthRoute component
import LoginPage from "./Login";
import Register from "./Register";
import Profile from "./ProfilePage";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </nav>
      </div>

      <Routes>
        <AuthRoute path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
