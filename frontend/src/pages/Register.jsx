import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Register = () => {
    const [inputs, setInputs] = useState({
        full_name: "",
        address: "",
        password: "",
        id_type: "",
    });

    const [err, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/customer", inputs);
            setSuccess("✅ Registration successful!");
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            setSuccess(null);
        }
    };

    return (
        <div className='auth-container'>
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Customer Registration 👤</h2>
                <input required type="text" placeholder='Full Name' name='full_name' onChange={handleChange} />
                <input required type="text" placeholder='Address' name='address' onChange={handleChange} />
                <input required type="text" placeholder='ID Type (e.g., SSN, SIN)' name='id_type' onChange={handleChange} />
                <input required type="password" placeholder='Password' name="password" onChange={handleChange} />

                {err && <p className="error-msg">{err}</p>}
                {success && <p className="success-msg">{success}</p>}

                <button type="submit">Register</button>
                <button type="button" className="back-btn" onClick={() => navigate('/')}>⬅ Back to Home</button>

                <span>Already have an account? <Link to="/login">Login here</Link></span>
            </form>
        </div>
    );
};

export default Register;
