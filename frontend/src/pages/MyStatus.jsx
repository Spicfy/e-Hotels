import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const MyStatus = () => {
    const [bookings, setBookings] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("user"));
        if (!stored || stored.role !== "Customer") {
            alert("You must be logged in as a customer.");
            navigate('/');
            return;
        }
        setUser(stored);
        fetchStatus(stored.id);
    }, []);

    const fetchStatus = async (customerId) => {
        try {
            const [bookingRes, rentalRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/my-bookings/${customerId}`),
                axios.get(`http://localhost:5000/api/my-rentals/${customerId}`)
            ]);
            setBookings(bookingRes.data);
            setRentals(rentalRes.data);
        } catch (err) {
            console.error("Error fetching status:", err);
        }
    };

    return (
        <div className="room-container">
            <h2 className="page-title">📋 My Booking & Renting Status</h2>

            <div className="status-section">
                <h3>📅 Bookings</h3>
                {bookings.length > 0 ? bookings.map((b, idx) => (
                    <div className="room-card" key={idx}>
                        <p><strong>Room #{b.room_number}</strong> ({b.hotel_name}, {b.area})</p>
                        <p>Check-in: {b.check_in_date}</p>
                        <p>Check-out: {b.check_out_date}</p>
                        <p>Status: {b.status}</p>
                    </div>
                )) : <p>No current bookings.</p>}
            </div>

            <div className="status-section">
                <h3>🛏️ Rentals</h3>
                {rentals.length > 0 ? rentals.map((r, idx) => (
                    <div className="room-card" key={idx}>
                        <p><strong>Room #{r.room_number}</strong> ({r.hotel_name}, {r.area})</p>
                        <p>Check-in: {r.check_in_date}</p>
                        <p>Check-out: {r.check_out_date}</p>
                        <p>Status: {r.status}</p>
                    </div>
                )) : <p>No current rentals.</p>}
            </div>

            <button className="back-btn" onClick={() => navigate('/')}>⬅ Back to Home</button>
        </div>
    );
};

export default MyStatus;