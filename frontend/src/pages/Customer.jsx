import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Customer = () => {
    const [formData, setFormData] = useState({
        customer_id: "",
        full_name: "",
        password: "",
        address: "",
        id_type: "",
        registration: "",
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInsert = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/customer", formData);
            setMessage(response.data.message || "✅ Customer added successfully!");
        } catch (error) {
            setMessage("❌ Error adding customer.");
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/customer/${formData.customer_id}`, formData);
            setMessage(response.data.message || "✅ Customer updated successfully!");
        } catch (error) {
            setMessage("❌ Error updating customer.");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/customer/${formData.customer_id}`);
            setMessage(response.data.message || "✅ Customer deleted successfully!");
        } catch (err) {
            setMessage("❌ Error deleting customer.");
        }
    };

    return (
        <div className="admin-container">
            <h2 className="page-title">👥 Manage Customers</h2>
            <div className="form-container">
                <input className="constant-field" type="number" name="customer_id" placeholder="Customer ID" onChange={handleChange} />
                <input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <input type="text" name="address" placeholder="Address" onChange={handleChange} />
                <input type="text" name="id_type" placeholder="ID Type (SSN/SIN)" onChange={handleChange} />
                <input type="date" name="registration" onChange={handleChange} />

                <button onClick={handleInsert}>➕ Insert</button>
                <button onClick={handleUpdate} disabled={!formData.customer_id}>🔄 Update</button>
                <button onClick={handleDelete} disabled={!formData.customer_id}>🗑️ Delete</button>
                <button className="back-btn" onClick={() => navigate('/admin')}>⬅ Back to Admin</button>

                {message && <p className="result-msg">{message}</p>}
            </div>
        </div>
    );
};

export default Customer;
