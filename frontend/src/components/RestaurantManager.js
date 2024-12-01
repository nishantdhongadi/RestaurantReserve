import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

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
    rating: '',
    tableNumber: '',
  });
  const [message, setMessage] = useState('');

  const apiUrl = 'http://localhost:3001'; 

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(`${apiUrl}/restaurants`);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
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

  // Handle adding or updating a restaurant
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRestaurant) {
        // Update restaurant
        await axios.put(`${apiUrl}/restaurants/${editingRestaurant._id}`, formData);
        setMessage('Restaurant updated successfully');
      } else {
        // Add restaurant
        await axios.post(`${apiUrl}/restaurants`, formData);
        setMessage('Restaurant added successfully');
      }
      setShowModal(false);
      fetchRestaurants();
    } catch (error) {
      console.error('Error submitting restaurant:', error);
      setMessage('Error adding/updating restaurant');
    }
  };

  // Handle deleting a restaurant
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/restaurants/${id}`);
      setMessage('Restaurant deleted successfully');
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      setMessage('Error deleting restaurant');
    }
  };

  // Handle opening the modal for editing
  const handleEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData(restaurant);
    setShowModal(true);
  };

  // Handle opening the modal for adding
  const handleAdd = () => {
    setEditingRestaurant(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      cuisine: '',
      hours: '',
      rating: '',
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
            <th>Rating</th>
            <th>Table Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => (
            <tr key={restaurant._id}>
              <td>{restaurant.name}</td>
              <td>{restaurant.address}</td>
              <td>{restaurant.phone}</td>
              <td>{restaurant.email}</td>
              <td>{restaurant.cuisine}</td>
              <td>{restaurant.hours}</td>
              <td>{restaurant.rating}</td>
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
          ))}
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
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hours</Form.Label>
              <Form.Control
                type="text"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="1"
                max="5"
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
