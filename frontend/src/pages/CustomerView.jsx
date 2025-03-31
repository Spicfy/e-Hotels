import React, { useState } from "react";
import axios from "axios";
import '../App.css';
import { useNavigate } from 'react-router-dom';


const AvailableRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        capacity: "",
        area: "",
        hotelChain: "",
        category: "",
        maxPrice: ""
    });

    const fetchRooms = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/available-rooms", { params: filters });
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };
    const navigate = useNavigate();
    return (
        <div className="room-container">
            <h2 className="page-title">Available Rooms 🏨</h2>

            <div className="filter-section">
                <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                <input type="number" name="capacity" placeholder="Capacity" value={filters.capacity} onChange={handleFilterChange} />
                <input type="text" name="area" placeholder="Area" value={filters.area} onChange={handleFilterChange} />
                <input type="text" name="hotelChain" placeholder="Hotel Chain" value={filters.hotelChain} onChange={handleFilterChange} />
                <input type="text" name="category" placeholder="Category" value={filters.category} onChange={handleFilterChange} />
                <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleFilterChange} />

                <button className="apply-btn" onClick={fetchRooms}>🔍 Search Rooms</button>
                <button className="back-btn" onClick={() => navigate('/')}>⬅ Back to Home</button>
            </div>

            <div className="rooms-grid">
                {rooms.length > 0 ? (
                    rooms.map((room) => (
                        <div key={room.room_id} className="room-card">
                            <h3>{room.hotel_name} ({room.area})</h3>
                            <p><strong>Room Number:</strong> {room.room_number}</p>
                            <p><strong>Price:</strong> ${room.price}</p>
                            <p><strong>Capacity:</strong> {room.capacity} persons</p>
                            <p><strong>Sea View:</strong> {room.sea_view ? "✅" : "❌"}</p>
                            <p><strong>Extendable:</strong> {room.extendable ? "✅" : "❌"}</p>
                            <button className="book-btn">📅 Book Now</button>
                        </div>
                    ))
                ) : (
                    <p className="no-rooms-msg">No available rooms found. Try adjusting your search criteria.</p>
                )}
            </div>
        </div>
    );
};

export default AvailableRooms;
