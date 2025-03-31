import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const TotalRooms = () => {
    const [hotelName, setHotelName] = useState("");
    const [hotelList, setHotelList] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const navigate = useNavigate();

    // Fetch all hotel names for dropdown
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/filters/hotels");
                setHotelList(res.data || []);
            } catch (err) {
                console.error("Error fetching hotels:", err);
            }
        };
        fetchHotels();
    }, []);

    const fetchRooms = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/totalrooms", { params: { name: hotelName } });
            setRoomList(res.data || []);
        } catch (err) {
            console.error("Error fetching room list:", err);
            setRoomList([]);
        }
    };

    return (
        <div className="room-container">
            <h2 className="page-title">Total Capacity by Hotel 🏨</h2>
            <div className="filter-section">
                <select value={hotelName} onChange={(e) => setHotelName(e.target.value)}>
                    <option value="">Select Hotel</option>
                    {hotelList.map((hotel, idx) => (
                        <option key={idx} value={hotel}>{hotel}</option>
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
                    <p className="no-rooms-msg">No rooms found for the selected hotel.</p>
                )}
            </div>
        </div>
    );
};

export default TotalRooms;