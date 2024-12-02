import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import api from '../utils/api';

const RestaurantManager = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Address: '',
    PhoneNumber: '',
    Email: '',
    Cuisine: '',
    OperatingHours: '',
    TableNumber: '',
  });
  const [message, setMessage] = useState('');

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    try {
      console.log('Fetching all restaurants...');
      const response = await api.get('/restaurants');
      console.log('Fetched Restaurants:', response.data);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error.response || error.message);
      setMessage('Error fetching restaurants');
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting restaurant:', formData);
    try {
      if (editingRestaurant) {
        await api.put(`/restaurants/${editingRestaurant.RestaurantID}`, formData);
        setMessage('Restaurant updated successfully');
      } else {
        await api.post('/restaurants/add', formData);
        setMessage('Restaurant added successfully');
      }
      setShowModal(false);
      fetchRestaurants();
    } catch (error) {
      console.error('Error submitting restaurant:', error.response || error.message);
      setMessage('Error adding/updating restaurant');
    }
  };

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

  const handleEdit = (restaurant) => {
    console.log('Editing restaurant:', restaurant);
    setEditingRestaurant(restaurant);
    setFormData({
      Name: restaurant.Name,
      Address: restaurant.Address,
      PhoneNumber: restaurant.PhoneNumber,
      Email: restaurant.Email,
      Cuisine: restaurant.Cuisine,
      OperatingHours: restaurant.OperatingHours,
      TableNumber: restaurant.TableNumber,
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    console.log('Adding a new restaurant...');
    setEditingRestaurant(null);
    setFormData({
      Name: '',
      Address: '',
      PhoneNumber: '',
      Email: '',
      Cuisine: '',
      OperatingHours: '',
      TableNumber: '',
    });
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Restaurant Manager</h2>
      {message && <Alert variant="info" onClose={() => setMessage('')} dismissible>{message}</Alert>}
      <Button variant="primary" className="mb-3" onClick={handleAdd}>Add Restaurant</Button>
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
              <tr key={restaurant.RestaurantID}>
                <td>{restaurant.Name}</td>
                <td>{restaurant.Address}</td>
                <td>{restaurant.PhoneNumber}</td>
                <td>{restaurant.Email}</td>
                <td>{restaurant.Cuisine}</td>
                <td>{restaurant.OperatingHours}</td>
                <td>{restaurant.TableNumber}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleEdit(restaurant)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(restaurant.RestaurantID)}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No restaurants available.</td>
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
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="Address"
                value={formData.Address}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="PhoneNumber"
                value={formData.PhoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cuisine</Form.Label>
              <Form.Control
                type="text"
                name="Cuisine"
                value={formData.Cuisine}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Operating Hours</Form.Label>
              <Form.Control
                type="text"
                name="OperatingHours"
                value={formData.OperatingHours}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Table Number</Form.Label>
              <Form.Control
                type="text"
                name="TableNumber"
                value={formData.TableNumber}
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