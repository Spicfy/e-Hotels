import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const RoomsByArea = () => {
    const [area, setArea] = useState("");
    const [areasList, setAreasList] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/filters/areas");
                setAreasList(res.data || []);
            } catch (err) {
                console.error("Error fetching areas:", err);
            }
        };
        fetchAreas();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/roomsbyarea", { params: { area } });
            setRoomList(response.data || []);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            setRoomList([]);
        }
    };

    return (
        <div className="room-container">
            <h2 className="page-title">Rooms By Area 🌍</h2>
            <div className="filter-section">
                <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                >
                    <option value="">Select Area</option>
                    {areasList.map((a, idx) => (
                        <option key={idx} value={a}>{a}</option>
                    ))}
                </select>
                <button className="apply-btn" onClick={fetchRooms}>🔍 Search</button>
                <button className="back-btn" onClick={() => navigate('/')}>⬅ Back to Home</button>
            </div>

            <div className="rooms-grid">
                {roomList.length > 0 ? (
                    roomList.map((room) => (
                        <div key={room.room_id} className="room-card">
                            <h3>{room.hotel_name} ({room.area})</h3>
                            <p><strong>Room Number:</strong> {room.room_number}</p>
                            <p><strong>Stars:</strong> {room.hotel_category} ⭐</p>
                            <p><strong>Price:</strong> ${room.price}</p>
                            <p><strong>Capacity:</strong> {room.capacity} persons</p>
                            <p><strong>Sea View:</strong> {room.sea_view ? "✅" : "❌"}</p>
                            <p><strong>Extendable:</strong> {room.extendable ? "✅" : "❌"}</p>
                        </div>
                    ))
                ) : (
                    <p className="no-rooms-msg">No available rooms found in this area.</p>
                )}
            </div>
        </div>
    );
};

export default RoomsByArea;