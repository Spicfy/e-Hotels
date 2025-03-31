import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Login = () => {
    const [inputs, setInputs] = useState({ full_name: "", password: "" });
    const [err, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/login", inputs);
            const customer = res.data.customer;

            localStorage.setItem("user", JSON.stringify({
                id: res.data.customer.customer_id,   
                name: res.data.customer.full_name,
                role: "Customer"
            }));

            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className='auth-container'>
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Customer Login 🔐</h2>
                <input required type="text" placeholder='Full Name' name='full_name' onChange={handleChange} />
                <input required type="password" placeholder='Password' name="password" onChange={handleChange} />
                {err && <p className="error-msg">{err}</p>}
                <button type="submit">Login</button>
                <button type="button" className="back-btn" onClick={() => navigate('/')}>⬅ Back to Home</button>
                <span>Don't have an account? <Link to="/sign-up">Register here</Link></span>
            </form>
        </div>
    );
};

export default Login;