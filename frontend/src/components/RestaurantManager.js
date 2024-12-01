import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import TimePicker from 'react-time-picker';
import api from '../utils/api';

const RestaurantManager = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    cuisine: '',
    hours: '',
    tableNumber: '',
  });
  const [message, setMessage] = useState('');

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    try {
      console.log('Fetching restaurants...');
      const response = await api.get('/restaurants');
      console.log('Fetched Restaurants:', response.data);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error.response || error.message);
      setMessage('Error fetching restaurants');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTimeChange = (value) => {
    setFormData({
      ...formData,
      hours: value,
    });
  };

  // Handle adding or updating a restaurant
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting Form Data:', formData);
    try {
      if (editingRestaurant) {
        // Update restaurant
        const response = await api.put(`/restaurants/${editingRestaurant._id}`, formData);
        console.log('Update Response:', response.data);
        setMessage('Restaurant updated successfully');
      } else {
        // Add restaurant
        const response = await api.post('/restaurants', formData);
        console.log('Add Response:', response.data);
        setMessage('Restaurant added successfully');
      }
      setShowModal(false);
      fetchRestaurants(); // Refresh restaurant list after submission
    } catch (error) {
      console.error('Error submitting restaurant:', error.response || error.message);
      setMessage('Error adding/updating restaurant');
    }
  };

  // Handle deleting a restaurant
  const handleDelete = async (id) => {
    try {
      console.log('Deleting restaurant with ID:', id);
      await api.delete(`/restaurants/${id}`);
      setMessage('Restaurant deleted successfully');
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error.response || error.message);
      setMessage('Error deleting restaurant');
    }
  };

  // Handle opening the modal for editing
  const handleEdit = (restaurant) => {
    console.log('Editing restaurant:', restaurant);
    setEditingRestaurant(restaurant);
    setFormData(restaurant);
    setShowModal(true);
  };

  // Handle opening the modal for adding
  const handleAdd = () => {
    console.log('Adding a new restaurant...');
    setEditingRestaurant(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      cuisine: '',
      hours: '',
      tableNumber: '',
    });
    setShowModal(true);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Restaurant Manager</h2>

      {message && <Alert variant="info" onClose={() => setMessage('')} dismissible>{message}</Alert>}

      <Button variant="primary" className="mb-3" onClick={handleAdd}>
        Add Restaurant
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Cuisine</th>
            <th>Hours</th>
            <th>Table Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <tr key={restaurant._id}>
                <td>{restaurant.name}</td>
                <td>{restaurant.address}</td>
                <td>{restaurant.phone}</td>
                <td>{restaurant.email}</td>
                <td>{restaurant.cuisine}</td>
                <td>{restaurant.hours}</td>
                <td>{restaurant.tableNumber}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(restaurant)}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(restaurant._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No restaurants available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cuisine</Form.Label>
              <Form.Control
                as="select"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                required
              >
                <option value="">Select Cuisine</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Mexican">Mexican</option>
                <option value="Indian">Indian</option>
                <option value="French">French</option>
                <option value="Japanese">Japanese</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hours</Form.Label>
              <TimePicker
                name="hours"
                value={formData.hours}
                onChange={handleTimeChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Table Number</Form.Label>
              <Form.Control
                type="number"
                name="tableNumber"
                value={formData.tableNumber}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              {editingRestaurant ? 'Update Restaurant' : 'Add Restaurant'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RestaurantManager;