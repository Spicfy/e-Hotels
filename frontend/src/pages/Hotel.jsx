import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Hotel = () => {
    const [formData, setFormData] = useState({
        hotel_id: "",
        employee_id: "",
        chain_id: "",
        name: "",
        stars: "",
        address: "",
        contact_email: "",
        contact_phone: "",
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInsert = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/hotel", formData);
            setMessage(response.data.message || "✅ Hotel added successfully!");
        } catch (error) {
            setMessage("❌ Error adding hotel.");
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/hotel/${formData.hotel_id}`, formData);
            setMessage(response.data.message || "✅ Hotel updated successfully!");
        } catch (error) {
            setMessage("❌ Error updating hotel.");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/hotel/${formData.hotel_id}`);
            setMessage(response.data.message || "✅ Hotel deleted successfully!");
        } catch (err) {
            setMessage("❌ Error deleting hotel.");
        }
    };

    return (
        <div className="admin-container">
            <h2 className="page-title">🏨 Manage Hotels</h2>
            <div className="form-container">
                <input type="number" name="hotel_id" placeholder="Hotel ID" onChange={handleChange} />
                <input type="number" name="employee_id" placeholder="Employee ID" onChange={handleChange} />
                <input type="number" name="chain_id" placeholder="Chain ID" onChange={handleChange} />
                <input type="text" name="name" placeholder="Hotel Name" onChange={handleChange} />
                <input type="number" name="stars" placeholder="Stars" onChange={handleChange} />
                <input type="text" name="address" placeholder="Address" onChange={handleChange} />
                <input type="text" name="contact_email" placeholder="Contact Email" onChange={handleChange} />
                <input type="text" name="contact_phone" placeholder="Contact Phone" onChange={handleChange} />

                <button onClick={handleInsert}>➕ Insert</button>
                <button onClick={handleUpdate} disabled={!formData.hotel_id}>🔄 Update</button>
                <button onClick={handleDelete} disabled={!formData.hotel_id}>🗑️ Delete</button>
                <button className="back-btn" onClick={() => navigate('/admin')}>⬅ Back to Admin</button>

                {message && <p className="result-msg">{message}</p>}
            </div>
        </div>
    );
};

export default Hotel;
