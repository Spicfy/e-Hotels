
import React, { useState, useEffect } from "react";
import axios from "axios";


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

    // useEffect(() => {
    //     fetchRooms();
    // }, []);

    const fetchRooms = async (queryParams = {}) => {
        try {
            const response = await axios.get("http://localhost:3000/api/available-rooms", { params: queryParams });
            setRooms(response.data);
            console.log(queryParams);
            
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        fetchRooms(filters);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} placeholder="Check-in Date" />
                <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} placeholder="Check-out Date" />
                <input type="number" name="capacity" value={filters.capacity} onChange={handleFilterChange} placeholder="Capacity" />
                <input type="text" name="area" value={filters.area} onChange={handleFilterChange} placeholder="Area" />
                <input type="text" name="hotelChain" value={filters.hotelChain} onChange={handleFilterChange} placeholder="Hotel Chain" />
                <input type="text" name="category" value={filters.category} onChange={handleFilterChange} placeholder="Category" />
                <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max Price" />
            </div>

            <button onClick={applyFilters} className="mb-4">Apply Filters</button>

            {/* Room Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.length > 0 ? (
                    rooms.map((room) => (
                        <div key={room.room_id} className="p-4 shadow-lg">
                            
                                <h3 className="text-lg font-semibold">{room.hotel_name}</h3>
                                <p className="text-sm text-gray-600">{room.area}</p>
                                <p className="mt-2"><strong>Room Number:</strong> {room.room_number}</p>
                                <p><strong>Price:</strong> ${room.price}</p>
                                <p><strong>Capacity:</strong> {room.capacity} people</p>
                                <p><strong>Sea View:</strong> {room.sea_view ? "Yes" : "No"}</p>
                                <p><strong>Extendable:</strong> {room.extendable ? "Yes" : "No"}</p>
                                <button className="mt-4 w-full">Book Now</button>
                            
                        </div>
                    ))
                ) : (
                    <p>No available rooms found.</p>
                )}
            </div>
        </div>
    );
};

export default AvailableRooms;
