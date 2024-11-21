// src/components/DeleteAccount.js
import React, { useState } from 'react';
import api from '../utils/api';

function DeleteAccount() {
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    try {
      await api.delete('/auth/delete');
      localStorage.removeItem('token');
      setMessage('Account deleted successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Deletion failed');
    }
  };

  return (
    <div>
      <h2>Delete Account</h2>
      <button onClick={handleDelete}>Delete My Account</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default DeleteAccount;
