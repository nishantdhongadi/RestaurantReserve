// src/components/ResetPassword.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';

function ResetPassword() {
  const query = new URLSearchParams(useLocation().search);
  const [formData, setFormData] = useState({
    email: query.get('email') || '',
    token: query.get('token') || '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      newPassword: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/reset-password', formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="newPassword"
          type="password"
          placeholder="New Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPassword;
