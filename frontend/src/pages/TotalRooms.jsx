import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const TotalRooms = () => {
    const [rooms, setRooms] = useState({ total_capacity: 0 });
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const fetchRooms = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/totalrooms", { params: { name } });
            setRooms(response.data || { total_capacity: 0 });
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    return (
        <div className="room-container">
            <h2 className="page-title">Total Capacity by Hotel 📈</h2>
            <div className="filter-section">
                <input
                    type="text"
                    placeholder="Hotel Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button className="apply-btn" onClick={fetchRooms}>🔍 Search</button>
                <button className="back-btn" onClick={() => navigate('/')}>⬅ Back to Home</button>
            </div>
            <div className="result-section">
                <h3>Total Room Capacity: <span className="result-count">{rooms.total_capacity}</span></h3>
            </div>
        </div>
    );
};

export default TotalRooms;
