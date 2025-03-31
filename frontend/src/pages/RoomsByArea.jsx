import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const RoomsByArea = () => {
    const [rooms, setRooms] = useState({ available_rooms_count: 0 });
    const [area, setArea] = useState("");
    const navigate = useNavigate();

    const fetchRooms = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/roomsbyarea", { params: { area } });
            setRooms(response.data || { available_rooms_count: 0 });
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    return (
        <div className="room-container">
            <h2 className="page-title">Rooms By Area 🌍</h2>
            <div className="filter-section">
                <input
                    type="text"
                    placeholder="Enter Area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                />
                <button className="apply-btn" onClick={fetchRooms}>🔍 Search</button>
                <button className="back-btn" onClick={() => navigate('/')}>⬅ Back to Home</button>
            </div>
            <div className="result-section">
                <h3>Total Available Rooms: <span className="result-count">{rooms.available_rooms_count}</span></h3>
            </div>
        </div>
    );
};

export default RoomsByArea;
;