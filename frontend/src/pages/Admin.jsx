import React from "react";
import { Link, useNavigate } from "react-router-dom";
import '../App.css';

const Admin = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-container">
            <h2 className="page-title">🛠️ Admin Panel</h2>
            <div className="admin-menu">
                <Link to='/customer' className="admin-link">
                    👥 Manage Customers
                </Link>

                <Link to='/employee' className="admin-link">
                    🧑‍💼 Manage Employees
                </Link>

                <Link to='/room' className="admin-link">
                    🚪 Manage Rooms
                </Link>

                <Link to='/hotel' className="admin-link">
                    🏨 Manage Hotels
                </Link>

                <button className="back-btn" onClick={() => navigate('/')}>⬅ Back to Home</button>
            </div>
        </div>
    );
};

export default Admin;