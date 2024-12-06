import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ReservationPage = () => {
  const { restaurantId } = useParams(); // Get restaurantId from the route
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    numberOfGuests: '',
    notes: '',
  });
  const [message, setMessage] = useState('');

  // Fetch reservations for the restaurant
  const fetchReservations = async () => {
    try {
      console.log('Fetching reservations for restaurant:', restaurantId);
      const response = await api.get(`api/reservations/restaurant/${restaurantId}`);
      console.log('Fetched Reservations:', response.data);
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error.response || error.message);
      setMessage('Error fetching reservations.');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [restaurantId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Creating reservation with data:', formData);
    try {
      const response = await api.post(`api/reservations/`, {
        restaurantId: restaurantId,
        ...formData,
        userId: 1, // Replace this with the logged-in user's ID from context or token
      });
      setMessage('Reservation created successfully!');
      setShowModal(false);
      fetchReservations();
    } catch (error) {
      console.error('Error creating reservation:', error.response || error.message);
      setMessage('Error creating reservation.');
    }
  };

  const handleDelete = async (reservationId) => {
    try {
      console.log('Deleting reservation with ID:', reservationId);
      await api.delete(`api/reservations/${reservationId}`);
      setMessage('Reservation deleted successfully.');
      fetchReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error.response || error.message);
      setMessage('Error deleting reservation.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Reservations for Restaurant {restaurantId}</h2>
      {message && <Alert variant="info" onClose={() => setMessage('')} dismissible>{message}</Alert>}
      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        Make a Reservation
      </Button>
      <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
        Back to Restaurants
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Guests</th>
            <th>Notes</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <tr key={reservation.reservationid}>
                <td>{reservation.reservationdate}</td>
                <td>{reservation.reservationtime}</td>
                <td>{reservation.numberofguests}</td>
                <td>{reservation.notes}</td>
                <td>{reservation.status}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(reservation.reservationid)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No reservations available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Creating Reservation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Make a Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Number of Guests</Form.Label>
              <Form.Control
                type="number"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Confirm Reservation
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ReservationPage;