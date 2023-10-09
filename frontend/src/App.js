import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
        <nav>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>

      <Routes>
        <Route path="/" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

/*
import { Routes, Route, Link } from 'react-router-dom';

const App = () => {
  return (
    <>
      <h1>React Router</h1>

      <Navigation />

      <Routes>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
};

const Navigation = () => {
  return (
    <nav>
      <NavLink to="/home">Home</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
    </nav>
  );
};



import React from "react";
import { Route, BrowserRouter, Routes  } from "react-router-dom";
import RouteGuard from "./components/RouteGuard";

// history
import { history } from './helpers/history';

// pages
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

function Routes() {
  return (
    <Router history={history}>
      <RouteGuard
        exact
        path="/"
        component={ProfilePage}
      />
      <Route
        path="/login"
        component={Login}
      />
      <Route
        path="/register"
        component={Register}
      />
    </Router>
  );
}

export default Routes;*/