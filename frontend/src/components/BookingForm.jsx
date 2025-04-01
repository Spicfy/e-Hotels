import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function BookingForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { customer_id, room_id, check_in_date, check_out_date } = location.state || {};

    const [form, setForm] = useState({
        customer_id: customer_id || '',
        room_id: room_id || '',
        check_in_date: check_in_date || '',
        check_out_date: check_out_date || '',
        type: 'booking'  // 默认类型为 booking
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const endpoint =
                form.type === "booking"
                    ? "http://localhost:5000/api/bookings"
                    : "http://localhost:5000/api/rentals/direct";

            const payload =
                form.type === "booking"
                    ? {
                        customer_id: form.customer_id,
                        room_id: form.room_id,
                        check_in_date: form.check_in_date,
                        check_out_date: form.check_out_date
                    }
                    : {
                        customer_id: form.customer_id,
                        room_id: form.room_id,
                        employee_id: 1, // 可以替换为 localStorage 中的 employee_id
                        check_in_date: form.check_in_date,
                        check_out_date: form.check_out_date
                    };

            const res = await axios.post(endpoint, payload);
            setMessage("✅ Booking successful!");
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to submit booking.");
        }
    };

    return (
        <div className="form-container">
            <h2>📄 Booking Details</h2>
            <form onSubmit={handleSubmit}>
                <label>Customer ID:</label>
                <input name="customer_id" value={form.customer_id} readOnly />

                <label>Room ID:</label>
                <input name="room_id" value={form.room_id} readOnly />

                <label>Check-In Date:</label>
                <input
                    name="check_in_date"
                    type="date"
                    value={form.check_in_date}
                    onChange={handleChange}
                    required
                />

                <label>Check-Out Date:</label>
                <input
                    name="check_out_date"
                    type="date"
                    value={form.check_out_date}
                    onChange={handleChange}
                    required
                />

                <label>Type:</label>
                <select name="type" value={form.type} onChange={handleChange}>
                    <option value="booking">Booking</option>
                    <option value="rental">Direct Rental</option>
                </select>

                <button type="submit">✅ Confirm</button>
                <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>⬅ Back to Rooms</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default BookingForm;
