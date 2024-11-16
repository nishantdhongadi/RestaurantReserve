# CSE 412 Group Project: Restaurant Reservation System

## Project Description
This project is a full-stack web application that allows users to register, log in, and manage restaurant reservations. Users can create, view, update, and delete reservations. Additionally, it supports password reset functionality. 

The backend is built using **Node.js, Express, and PostgreSQL**. Authentication is handled using **JSON Web Tokens (JWT)**, and emails are sent using **Nodemailer**.

---

## Table of Contents
1. [Features](#features)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [API Endpoints](#api-endpoints)
8. [Testing](#testing)
9. [License](#license)

---

## Features
- User Registration and Authentication (JWT)
- Password reset functionality via email
- CRUD operations for reservations
- Authorization middleware to protect routes

## Technologies
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Email Service**: Nodemailer
- **Environment Variables**: dotenv

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nishantdhongadi/412-G5.git
   cd restaurant-reservation-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root with the following variables:
   ```env
   PORT=3000
   DB_USER=your_db_username
   DB_PASS=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=restaurant_booking
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

---

## Database Setup

1. **Ensure PostgreSQL is installed** on your system.

2. **Create the database**:
   ```sql
   CREATE DATABASE restaurant_booking;
   ```

3. **Set up the database schema**:
   Use the `ddl.ddl` file provided to create the necessary tables:
   ```bash
   psql -U your_db_username -d restaurant_booking -f ddl.ddl
   ```

4. **Verify that the tables have been created**:
   ```sql
   \c restaurant_booking
   \dt
   ```
   
---

## Running the Application

1. **Start the PostgreSQL server**:
   ```bash
   pg_ctl -D /usr/local/var/postgres start
   ```

2. **Start the application**:
   ```bash
   npm run dev
   ```
   The server will start on the port defined in your `.env` file (default is `3000`).

---

## API Endpoints

### **Authentication**

1. **Register a new user**
   - **POST** `/auth/register`
   - Request Body:
     ```json
     {
       "username": "JohnDoe",
       "email": "john@example.com",
       "password": "password123",
       "phoneNumber": "1234567890"
     }
     ```
   - Response:
     ```json
     { "message": "User registered successfully" }
     ```

2. **Log in a user**
   - **POST** `/auth/login`
   - Request Body:
     ```json
     {
       "email": "john@example.com",
       "password": "password123"
     }
     ```
   - Response:
     ```json
     { "token": "your_jwt_token" }
     ```

3. **Delete user account**
   - **DELETE** `/auth/delete`
   - Requires authentication (JWT token)

4. **Request password reset**
   - **POST** `/auth/request-reset`
   - Request Body:
     ```json
     { "email": "john@example.com" }
     ```

5. **Reset password**
   - **POST** `/auth/reset-password`
   - Request Body:
     ```json
     {
       "email": "john@example.com",
       "token": "reset_token",
       "newPassword": "newpassword123"
     }
     ```

### **Reservations**

1. **Create a reservation**
   - **POST** `/api/reservations`
   - Requires authentication
   - Request Body:
     ```json
     {
       "restaurantId": 1,
       "date": "2024-12-20",
       "time": "18:00",
       "numberOfGuests": 4,
       "notes": "Birthday celebration"
     }
     ```

2. **Get user reservations**
   - **GET** `/api/reservations/my-reservations`
   - Requires authentication

3. **Get reservations for a restaurant**
   - **GET** `/api/reservations/restaurant/:restaurantId`
   - Requires authentication

4. **Update reservation status**
   - **PATCH** `/api/reservations/:reservationId/status`
   - Requires authentication
   - Request Body:
     ```json
     { "status": "confirmed" }
     ```

5. **Delete a reservation**
   - **DELETE** `/api/reservations/:reservationId`
   - Requires authentication

---

## Testing

You can use tools like `Postman` or `curl` to test the endpoints. Make sure your PostgreSQL server is running and that you've set up the environment variables correctly.

Example for testing registration:

```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "JohnDoe", "email": "john@example.com", "password": "password123", "phoneNumber": "1234567890"}'
```

---

### Notes
- If you encounter any issues, make sure that your PostgreSQL database is set up correctly and that all environment variables are properly configured.
- Make sure your email credentials are valid and that you've enabled less secure apps (if using Gmail).
