CREATE DATABASE ehotel;

CREATE TABLE hotel_chains (
    chain_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    office_address VARCHAR(255) NOT NULL,
    num_hotels INTEGER DEFAULT 0,
    email VARCHAR(255),
    phone VARCHAR(20)
);
s

CREATE TABLE hotels (
    hotel_id SERIAL PRIMARY KEY,
    chain_id INTEGER REFERENCES hotel_chains(chain_id) ON DELETE CASCADE, -- ON DELETE CASCADE ensures that if a hotel chain is deleted, its hotels are also deleted
    name VARCHAR(255) NOT NULL,
    stars INTEGER CHECK (stars >= 1 AND stars <= 5),
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20)
);

CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    hotel_id INTEGER REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    price DECIMAL (10, 2) NOT NULL,

    amenities TEXT[], 
    capacity INTEGER,

    sea_view BOOLEAN DEFAULT FALSE,
    extendable BOOLEAN DEFAULT FALSE,
    damages TEXT,
    room_number VARCHAR(50) UNIQUE NOT NULL

);

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    password TEXT,
    address TEXT,
    id_type VARCHAR(50), -- SSN, SIN, Driving license, etc
    registration date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    address TEXT,
    ssn_sin VARCHAR(255) UNIQUE NOT NULL,
    hotel_id INTEGER REFERENCES hotels(hotel_id)
    password VARCHAR(255) NOT NULL --Link employee to a specific hotel
);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE employee_roles (
    employee_id INTEGER REFERENCES employees(employee_id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(role_id),
    PRIMARY KEY (employee_id, role_id)
);

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customer(customer_id),
    room_id INTEGER REFERENCES rooms(room_id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) CHECK (status IN ('confirmed', 'cancelled', 'checked_in', 'checked_out')),
);

CREATE TABLE archived_bookings (
    archived_booking_id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    room_id INTEGER,
    check_in_date DATE, 
    check_out_date DATE,
    booking_date TIMESTAMP,
    status VARCHAR(50)
)

-- Archived Rentings Table (History)
CREATE TABLE archived_rentings (
    archived_renting_id SERIAL PRIMARY KEY,
    customer_id INTEGER, -- Allow null in case customer is deleted
    room_id INTEGER, -- Allow null in case room is deleted
    employee_id INTEGER,
    check_in_date DATE,
    check_out_date DATE,
    renting_date TIMESTAMP
);

-- Add a manager to hotel relationship
ALTER TABLE hotels ADD COLUMN manager_id INTEGER REFERENCES employees(employee_id);

--View to see all available rooms
CREATE VIEW available_rooms AS
 SELECT h.address AS area,
    h.name AS hotel_name,
    h.stars AS hotel_category,
    r.room_id,
    r.price,
    r.capacity,
    r.sea_view,
    r.extendable
   FROM hotels h
     JOIN rooms r ON h.hotel_id = r.hotel_id
     LEFT JOIN bookings b ON r.room_id = b.room_id AND (b.status::text = 'confirmed'::text OR b.status::text = 'checked_in'::text) AND (b.check_in_date >= CURRENT_DATE AND b.check_in_date <= (CURRENT_DATE + '30 days'::interval) OR b.check_out_date >= CURRENT_DATE AND b.check_out_date <= (CURRENT_DATE + '30 days'::interval) OR b.check_in_date <= CURRENT_DATE AND b.check_out_date >= (CURRENT_DATE + '30 days'::interval))
  WHERE b.booking_id IS NULL;

CREATE VIEW available_rooms_per_area AS
SELECT 
    h.address AS area,
    COUNT(r.room_id) AS available_rooms_count
FROM 
    hotels h
JOIN 
    rooms r ON h.hotel_id = r.hotel_id
LEFT JOIN 
    bookings b ON r.room_id = b.room_id
    AND (b.status IN ('confirmed', 'checked_in'))
    AND (
        b.check_in_date <= CURRENT_DATE AND b.check_out_date >= CURRENT_DATE
    )
WHERE 
    b.booking_id IS NULL
GROUP BY 
    h.address;

CREATE VIEW aggregated_room_capacity_per_hotel AS
SELECT 
    h.name AS hotel_name,
    SUM(r.capacity) AS total_capacity
FROM 
    hotels h
JOIN 
    rooms r ON h.hotel_id = r.hotel_id
GROUP BY 
    h.name;

