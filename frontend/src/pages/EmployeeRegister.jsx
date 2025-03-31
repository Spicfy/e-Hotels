import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const EmployeeRegister = () => {
    const [inputs, setInputs] = useState({
        full_name: "",
        address: "",
        password: "",
        ssn_sin: "",
        hotel_id: ""
    });

    const [err, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.name === "hotel_id"
            ? parseInt(e.target.value)
            : e.target.value;

        setInputs(prev => ({ ...prev, [e.target.name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/employee", inputs);
            setSuccess("✅ Employee account created successfully!");
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            setSuccess(null);
        }
    };

    return (
        <div className='auth-container'>
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Employee Registration 🛎️</h2>
                <input required type="text" placeholder='Full Name' name='full_name' onChange={handleChange} />
                <input required type="text" placeholder='Address' name='address' onChange={handleChange} />
                <input required type="text" placeholder='SSN/SIN' name='ssn_sin' onChange={handleChange} />
                <input required type="password" placeholder='Password' name="password" onChange={handleChange} />
                <input required type="number" placeholder='Hotel ID' name="hotel_id" onChange={handleChange} />

                {err && <p className="error-msg">{err}</p>}
                {success && <p className="success-msg">{success}</p>}

                <button type="submit">Register</button>
                <button type="button" className="back-btn" onClick={() => navigate('/')}>⬅ Back to Home</button>

                <span>Already have an employee account? <Link to="/employee-login">Login here</Link></span>
            </form>
        </div>
    );
};

export default EmployeeRegister;
