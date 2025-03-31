import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const EmployeeLogin = () => {
    const [inputs, setInputs] = useState({ ssn_sin: "", password: "" });
    const [err, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/employee/login", inputs);
            localStorage.setItem("user", JSON.stringify({
                id: res.data.employee.employee_id,
                name: res.data.employee.full_name,
                role: "Employee"
            }));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className='auth-container'>
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Employee Login 🔐</h2>
                <input required type="text" placeholder='SSN/SIN' name='ssn_sin' onChange={handleChange} />
                <input required type="password" placeholder='Password' name="password" onChange={handleChange} />
                {err && <p className="error-msg">{err}</p>}
                <button type="submit">Login</button>
                <button type="button" className="back-btn" onClick={() => navigate('/')}>⬅ Back to Home</button>
                <span>No employee account yet? <Link to="/employee-sign-up">Register here</Link></span>
            </form>
        </div>
    );
};

export default EmployeeLogin;