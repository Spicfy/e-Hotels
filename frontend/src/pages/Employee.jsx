import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Employee = () => {
    const [formData, setFormData] = useState({
        employee_id: "",
        full_name: "",
        address: "",
        ssn_sin: "",
        hotel_id: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInsert = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/employee", formData);
            setMessage(response.data.message || "✅ Employee added successfully!");
        } catch (error) {
            setMessage("❌ Error adding employee.");
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/employee/${formData.employee_id}`, formData);
            setMessage(response.data.message || "✅ Employee updated successfully!");
        } catch (error) {
            setMessage("❌ Error updating employee.");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/employee/${formData.employee_id}`);
            setMessage(response.data.message || "✅ Employee deleted successfully!");
        } catch (err) {
            setMessage("❌ Error deleting employee.");
        }
    };

    return (
        <div className="admin-container">
            <h2 className="page-title">🧑‍💼 Manage Employees</h2>
            <div className="form-container">
                <input type="number" name="employee_id" placeholder="Employee ID" onChange={handleChange} />
                <input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <input type="text" name="address" placeholder="Address" onChange={handleChange} />
                <input type="text" name="ssn_sin" placeholder="SSN/SIN" onChange={handleChange} />
                <input type="number" name="hotel_id" placeholder="Hotel ID" onChange={handleChange} />

                <button onClick={handleInsert}>➕ Insert</button>
                <button onClick={handleUpdate} disabled={!formData.employee_id}>🔄 Update</button>
                <button onClick={handleDelete} disabled={!formData.employee_id}>🗑️ Delete</button>
                <button className="back-btn" onClick={() => navigate('/admin')}>⬅ Back to Admin</button>

                {message && <p className="result-msg">{message}</p>}
            </div>
        </div>
    );
};

export default Employee;
