import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <Switch>
        <Route path="/login">
          {!isAuthenticated ? <Login /> : <Redirect to="/dashboard" />}
        </Route>
        <Route path="/dashboard">
          {isAuthenticated ? <Dashboard /> : <Redirect to="/login" />}
        </Route>
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default App;

