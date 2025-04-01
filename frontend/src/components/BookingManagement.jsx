// src/pages/BookingManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookingManagement = () => {
    const [orders, setOrders] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const employee = JSON.parse(localStorage.getItem('user'));
    const employeeId = employee?.id;

    useEffect(() => {
        if (!employee || employee.role !== 'Employee') {
            alert('Only logged-in employees can access this page.');
            navigate('/');
            return;
        }

        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/employee-orders/${employeeId}`);
            setOrders(res.data);
        } catch (err) {
            setMessage(`Error fetching orders: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleConvertBooking = async () => {
        if (!selectedBookingId) {
            setMessage("Please select a booking to convert.");
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/rentals/convert', {
                booking_id: selectedBookingId,
                employee_id: employeeId
            });
            setMessage(res.data.message || "Booking converted!");
            fetchOrders();
        } catch (err) {
            setMessage(`Error converting: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleDelete = async (id, type = 'booking') => {
        try {
            const endpoint = type === 'booking'
                ? `http://localhost:5000/api/bookings/${id}`
                : `http://localhost:5000/api/rental/${id}`;

            await axios.delete(endpoint);
            setMessage("Successfully deleted.");
            fetchOrders(); // refresh
        } catch (err) {
            setMessage("Error deleting: " + err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="admin-container">
            <h2>🏨 Manage Bookings & Rentals</h2>
            {message && <p className="result-msg">{message}</p>}
            <ul>
                {orders.map(order => (
                    <li key={`${order.type}-${order.id}`}>
                        <strong>{order.type}</strong> | ID: {order.id} | Room: {order.room_id} | Customer: {order.customer_id} |
                        {order.check_in_date} → {order.check_out_date} | Status: {order.status}
                        {order.type === 'booking' && (
                            <>
                                <input type="radio" name="selectedBooking" value={order.id} onChange={() => setSelectedBookingId(order.id)} />
                                <button onClick={() => handleConvertBooking()}>Convert to Rental</button>
                            </>
                        )}
                        <button onClick={() => handleDelete(order.id, order.type)}>🗑 Delete</button>
                    </li>
                ))}
            </ul>
            <button className="back-btn" onClick={() => navigate('/')}>⬅ Back to Home</button>
        </div>
    );
};

export default BookingManagement;