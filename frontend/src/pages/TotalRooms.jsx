import React from "react";
import { useState } from "react";
import axios from "axios";
const TotelRooms = () => {

    const [totalrooms, setRooms] = useState({
        total_capacity: 0,
    });
    const [name, setName] = useState("");
     

    // useEffect(() => {
    //     fetchRooms();
    // }, []);

    const fetchRooms = async () => {
        try {
            console.log(name);
            
            const response = await axios.get("http://localhost:3000/api/totalrooms", {
                params: {
                    name: name,
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
        setName(e.target.value);
    };

    const applyFilters = () => {
        fetchRooms(name);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>

            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <input type="text" name="name" value={name} onChange={handleFilterChange} placeholder="Hotel Name" />
            </div>

            <button onClick={applyFilters} className="mb-4">Search Rooms</button>

            <div>Total Capacity: {totalrooms.total_capacity}</div>

        
        </div>
    );
};

export default TotelRooms;