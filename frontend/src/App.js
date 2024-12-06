// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import RequestReset from './components/RequestReset';
import ResetPassword from './components/ResetPassword';
import DeleteAccount from './components/DeleteAccount';
import ReservationPage from './components/Reservation';
import RestaurantManager from './components/RestaurantManager';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/register">Register</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/request-reset">Forgot Password</Link> |{' '}
        <Link to="/delete-account">Delete Account</Link> |{' '}
        <Link to="/restaurants"> Restaurants </Link>

      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/reservations/:restaurantId" element={<ReservationPage />} />
        <Route path="/restaurants" element={<RestaurantManager />} />
        <Route path="*" element={<h2>404: Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
