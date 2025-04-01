
-- Drop existing tables if exist
DROP TABLE IF EXISTS rentals CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS hotel_chains CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS employees CASCADE;

-- Hotel chains
CREATE TABLE hotel_chains (
    chain_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    office_address TEXT,
    num_hotels INTEGER,
    email TEXT,
    phone TEXT
);

-- Hotels
CREATE TABLE hotels (
    hotel_id SERIAL PRIMARY KEY,
    chain_id INTEGER REFERENCES hotel_chains(chain_id),
    name TEXT NOT NULL,
    stars INTEGER CHECK (stars BETWEEN 1 AND 5),
    address TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    manager_id INTEGER
);

-- Employees
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    address TEXT,
    ssn_sin TEXT UNIQUE NOT NULL,
    hotel_id INTEGER REFERENCES hotels(hotel_id),
    password TEXT NOT NULL
);

-- Customers
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    address TEXT,
    password TEXT NOT NULL,
    id_type TEXT
);

-- Rooms
CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    hotel_id INTEGER REFERENCES hotels(hotel_id),
    price NUMERIC NOT NULL,
    amenities TEXT[],
    capacity INTEGER,
    sea_view BOOLEAN DEFAULT false,
    extendable BOOLEAN DEFAULT false,
    damages TEXT,
    room_number TEXT,
    image_url TEXT
);

-- Bookings
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    room_id INTEGER REFERENCES rooms(room_id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled'))
);

-- Rentals
CREATE TABLE rentals (
    rental_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    room_id INTEGER REFERENCES rooms(room_id),
    employee_id INTEGER REFERENCES employees(employee_id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    booking_id INTEGER REFERENCES bookings(booking_id) ON DELETE CASCADE
);

-- ✅ Booking & Rental Conflict Prevention
CREATE OR REPLACE FUNCTION prevent_booking_conflicts()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM bookings
        WHERE room_id = NEW.room_id
          AND status = 'confirmed'
          AND booking_id != COALESCE(NEW.booking_id, -1)
          AND (
            NEW.check_in_date BETWEEN check_in_date AND check_out_date
            OR NEW.check_out_date BETWEEN check_in_date AND check_out_date
            OR check_in_date BETWEEN NEW.check_in_date AND NEW.check_out_date
          )
    ) THEN
        RAISE EXCEPTION 'Room is already booked in this date range.';
END IF;

    IF EXISTS (
        SELECT 1 FROM rentals
        WHERE room_id = NEW.room_id
          AND (
            NEW.check_in_date BETWEEN check_in_date AND check_out_date
            OR NEW.check_out_date BETWEEN check_in_date AND check_out_date
            OR check_in_date BETWEEN NEW.check_in_date AND NEW.check_out_date
          )
    ) THEN
        RAISE EXCEPTION 'Room is already rented in this date range.';
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_booking_conflicts
    BEFORE INSERT OR UPDATE ON bookings
                         FOR EACH ROW EXECUTE FUNCTION prevent_booking_conflicts();

-- Rental conflict check
CREATE OR REPLACE FUNCTION prevent_rental_conflicts()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM bookings
        WHERE room_id = NEW.room_id
          AND status = 'confirmed'
          AND (
            NEW.check_in_date BETWEEN check_in_date AND check_out_date
            OR NEW.check_out_date BETWEEN check_in_date AND check_out_date
            OR check_in_date BETWEEN NEW.check_in_date AND NEW.check_out_date
          )
    ) THEN
        RAISE EXCEPTION 'Room is booked in this date range.';
END IF;

    IF EXISTS (
        SELECT 1 FROM rentals
        WHERE room_id = NEW.room_id
          AND rental_id != COALESCE(NEW.rental_id, -1)
          AND (
            NEW.check_in_date BETWEEN check_in_date AND check_out_date
            OR NEW.check_out_date BETWEEN check_in_date AND check_out_date
            OR check_in_date BETWEEN NEW.check_in_date AND NEW.check_out_date
          )
    ) THEN
        RAISE EXCEPTION 'Room is already rented in this date range.';
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_rental_conflicts
    BEFORE INSERT OR UPDATE ON rentals
                         FOR EACH ROW EXECUTE FUNCTION prevent_rental_conflicts();

-- View for available rooms
CREATE OR REPLACE VIEW available_rooms AS
SELECT
    r.*,
    h.name AS hotel_name,
    h.address AS area,
    h.stars AS hotel_category,
    hc.name AS hotel_chain_name
FROM rooms r
         JOIN hotels h ON r.hotel_id = h.hotel_id
         JOIN hotel_chains hc ON h.chain_id = hc.chain_id;

-- View for available room count per area
CREATE OR REPLACE VIEW available_rooms_per_area AS
SELECT h.address AS area, COUNT(*) AS available_rooms_count
FROM rooms r
         JOIN hotels h ON r.hotel_id = h.hotel_id
GROUP BY h.address;

-- Convert booking to rental procedure
CREATE OR REPLACE FUNCTION convert_booking_to_rental(IN book_id INTEGER, IN emp_id INTEGER)
RETURNS VOID AS $$
DECLARE
book_record RECORD;
BEGIN
SELECT * INTO book_record FROM bookings WHERE booking_id = book_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Booking % not found', book_id;
END IF;

INSERT INTO rentals (customer_id, room_id, employee_id, check_in_date, check_out_date, booking_id)
VALUES (book_record.customer_id, book_record.room_id, emp_id, book_record.check_in_date, book_record.check_out_date, book_id);

DELETE FROM bookings WHERE booking_id = book_id;
END;
$$ LANGUAGE plpgsql;

-- Stub function for payment
CREATE OR REPLACE FUNCTION register_payment(rent_id INTEGER, amt NUMERIC)
RETURNS VOID AS $$
BEGIN
    RAISE NOTICE 'Registered payment of $% for rental ID %', amt, rent_id;
END;
$$ LANGUAGE plpgsql;
