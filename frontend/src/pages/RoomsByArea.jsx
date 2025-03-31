import {React, useState} from 'react';
import axios from 'axios';
const RoomsByArea = () => {
    const [totalrooms, setRooms] = useState({
        available_rooms_count: 0,
    });
    const [area, setArea] = useState("");
     

    

    const fetchRooms = async () => {
        try {
            //console.log(area);
            
            const response = await axios.get("http://localhost:3000/api/roomsbyarea", {
                params: {
                    area: area,
                },
            }
            );
            setRooms(response.data||{total_capacity: 0});
            //console.log(queryParams);
           
            
            
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const handleFilterChange = (e) => {
        setArea(e.target.value);
    };

    const applyFilters = () => {
        fetchRooms(area);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>

            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <input type="text" name="area" value={area} onChange={handleFilterChange} placeholder="Address " />
            </div>

            <button onClick={applyFilters} className="mb-4">Search Rooms</button>

            <div>Total Rooms: {totalrooms.available_rooms_count}</div>

        
        </div>
    );

}

export default RoomsByArea;