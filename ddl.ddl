CREATE TABLE Users (
    UserID INT PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PhoneNumber VARCHAR(15),
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE Restaurants (
    RestaurantID INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(15),
    Email VARCHAR(255),
    Cuisine VARCHAR(255),
    OperatingHours VARCHAR(255),
    AverageRating DECIMAL(3, 2),
    TableNumber VARCHAR(255)
);

CREATE TABLE Reservations (
    ReservationID INT PRIMARY KEY,
    UserID INT,
    RestaurantID INT,
    ReservationDate DATE,
    ReservationTime TIME,
    NumberOfGuests INT,
    Notes VARCHAR(255),
    Status VARCHAR(50),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID)
);

CREATE TABLE Reviews (
    ReviewID INT PRIMARY KEY,
    UserID INT,
    RestaurantID INT,
    RatingValue DECIMAL(2, 1),
    Comment TEXT,
    DatePosted DATE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID)
);
