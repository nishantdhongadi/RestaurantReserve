import React, { useState } from 'react';
import { Button, Alert, Container } from 'react-bootstrap';
import api from '../utils/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DeleteAccount.css';


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
    <Container className="delete-account-container">
      <h2 className="text-center mt-4">Delete Account</h2>
      <p className="text-center mt-3">
        Are you sure you want to delete your account? This action cannot be undone.
      </p>
      <div className="text-center">
        <Button variant="danger" onClick={handleDelete} className="delete-button">
          Delete My Account
        </Button>
      </div>
      {message && (
        <Alert className="mt-4" variant={message.includes('successfully') ? 'success' : 'danger'}>
          {message}
        </Alert>
      )}
    </Container>
  );
}

export default DeleteAccount;
