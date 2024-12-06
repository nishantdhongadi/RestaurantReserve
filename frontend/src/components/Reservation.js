import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ReservationPage = () => {
  const { restaurantId } = useParams(); // Get restaurantId from the route
  console.log('useParams:', { restaurantId });
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
        if (!restaurantId) {
            setMessage('Restaurant ID is missing. Unable to create reservation.');
            return;
          }
      console.log('Fetching reservations for restaurant:', restaurantId);
      const response = await api.get(`api/reservations/restaurant/${restaurantId}`);
      console.log('Fetched Reservations:', response.data);
      const normalizedReservations = Array.isArray(response.data)
      ? response.data.map((res) => ({
          reservationId: res.reservationid,
          date: res.reservationdate,
          time: res.reservationtime,
          guests: res.numberofguests,
          notes: res.notes,
          status: res.status,
        }))
      : [];
      setReservations(normalizedReservations);
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error fetching reservations.';
        console.error('Error fetching reservations:', error.response || error.message);
        setMessage(errorMessage);
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

    if (!restaurantId || !formData.date || !formData.time || !formData.numberOfGuests) {
        setMessage('All fields are required.');
        return;
      }

    console.log('restaurant Id:' , restaurantId)  
  
    const reservationDateTime = new Date(`${formData.date}T${formData.time}`);
    if (reservationDateTime < new Date()) {
      setMessage('Reservation date and time must be in the future.');
      return;
    }
      // Validate number of guests
    if (parseInt(formData.numberOfGuests, 10) <= 0) {
        setMessage('Number of guests must be greater than zero.');
        return;
    }
  
    console.log('Creating reservation with data:', formData);
    try {
      const response = await api.post(`api/reservations/`, {
        restaurantId: restaurantId,
        ...formData,
        numberOfGuests: parseInt(formData.numberOfGuests, 10), // Ensure it's a number
      });
      setMessage('Reservation created successfully!');
      setShowModal(false);
      setFormData({
        date: '',
        time: '',
        numberOfGuests: '',
        notes: '',
      });
      fetchReservations();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error creating reservation.';
      console.error('Error creating reservation:', error.response || error.message);
      setMessage(errorMessage);
    }
  };

  const handleDelete = async (reservationId) => {
    try {
      console.log('Deleting reservation with ID:', reservationId);
      await api.delete(`api/reservations/${reservationId}`);
      setMessage('Reservation deleted successfully.');
      fetchReservations();
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error deleting reservation.';
        console.error('Error deleting reservation:', error.response || error.message);
        setMessage(errorMessage);
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
                <tr key={reservation.reservationId}>
                <td>{reservation.date}</td>
                <td>{reservation.time}</td>
                <td>{reservation.guests}</td>
                <td>{reservation.notes}</td>
                <td>{reservation.status}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(reservation.reservationId)}
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