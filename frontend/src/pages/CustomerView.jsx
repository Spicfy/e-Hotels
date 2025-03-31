import React, { useState, useEffect } from "react";
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
        hotel_name: "",
        category: "",
        maxPrice: ""
    });

    const [dropdowns, setDropdowns] = useState({
        areas: [],
        hotels: [],
        chains: [],
        categories: []
    });

    const navigate = useNavigate();

    // Fetch dropdown options and initial rooms once on mount
    useEffect(() => {
        const fetchDropdownsAndRooms = async () => {
            try {
                const [areasRes, hotelsRes, chainsRes, categoriesRes, roomsRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/filters/areas"),
                    axios.get("http://localhost:5000/api/filters/hotels"),
                    axios.get("http://localhost:5000/api/filters/chains"),
                    axios.get("http://localhost:5000/api/filters/categories"),
                    axios.get("http://localhost:5000/api/available-rooms"), // No filters: fetch all
                ]);

                setDropdowns({
                    areas: areasRes.data,
                    hotels: hotelsRes.data,
                    chains: chainsRes.data,
                    categories: categoriesRes.data,
                });

                setRooms(roomsRes.data);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        fetchDropdownsAndRooms();
    }, []);

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

    return (
        <div className="room-container">
            <h2 className="page-title">Available Rooms 🏨</h2>

            <div className="filter-section">
                <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                <input type="number" name="capacity" placeholder="Capacity" value={filters.capacity} onChange={handleFilterChange} />

                <select name="area" value={filters.area} onChange={handleFilterChange}>
                    <option value="">Select Area</option>
                    {dropdowns.areas.map((area, idx) => (
                        <option key={idx} value={area}>{area}</option>
                    ))}
                </select>

                <select name="hotel_name" value={filters.hotel_name} onChange={handleFilterChange}>
                    <option value="">Select Hotel</option>
                    {dropdowns.hotels.map((hotel, idx) => (
                        <option key={idx} value={hotel}>{hotel}</option>
                    ))}
                </select>

                <select name="hotelChain" value={filters.hotelChain} onChange={handleFilterChange}>
                    <option value="">Select Hotel Chain</option>
                    {dropdowns.chains.map((chain, idx) => (
                        <option key={idx} value={chain}>{chain}</option>
                    ))}
                </select>

                <select name="category" value={filters.category} onChange={handleFilterChange}>
                    <option value="">Select Star Rating</option>
                    {dropdowns.categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat} Stars</option>
                    ))}
                </select>

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