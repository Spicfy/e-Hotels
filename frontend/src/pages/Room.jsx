import React, { useState} from "react";
import axios from "axios";



function App() {
    const [formData, setFormData] = useState({
        room_id: "",
        hotel_id: "",
        price: "",
        amenities: "",
        capacity: "",
        sea_view: false,
        extendable: false,
        damages: "",
        room_number: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
  
    const handleInsert = async () => {
      try {
          const response = await axios.post(
              "http://localhost:3000/api/room",
              formData,
              {
                headers: { "Content-Type": "application/json" },
              }
            );
  
       
        setMessage(response.data.message || "Room added successfully!");
      } catch (error) {
        setMessage("Error adding room.");
      }
    };
  
    const handleUpdate = async () => {
      try {
          const response = await axios.put(
              `http://localhost:3000/api/room/${formData.room_id}`,
              {
                hotel_id: formData.hotel_id,
                price: formData.price,
                amenities: formData.amenities,
                capacity: formData.capacity,
                sea_view: formData.sea_view,
                extendable: formData.extendable,
                damages: formData.damages,
                room_number: formData.room_number,
                
              },
              {
                headers: { "Content-Type": "application/json" },
              }
            );
            
       
        setMessage(response.data.message || "Room updated successfully!");
      } catch (error) {
        setMessage("Error updating Room.");
      }
    };
  
    // Delete a customer by customer_id
    const handleDelete = async () => {
      try {
          const response = await axios.delete(
              `http://localhost:3000/api/room/${formData.room_id}`
            );
            
        setMessage(response.data.message || "Room deleted successfully!");
      } catch (err) {
        setMessage("Error deleting room.");
      }
    };
  
    return (
      <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
        <h2>Manage Room</h2>
        <input type="number" name="room_id" value={formData.room_id} onChange={handleChange} placeholder="Room ID"  />

        <input type="number" name="hotel_id" value={formData.hotel_id} onChange={handleChange} placeholder="Hotel ID" />
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" />
                <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Amenities (comma separated)" />
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Capacity" />
                <label>
                    <input type="checkbox" name="sea_view" checked={formData.sea_view} onChange={handleChange} />
                    Sea View
                </label>
                <label>
                    <input type="checkbox" name="extendable" checked={formData.extendable} onChange={handleChange} />
                    Extendable
                </label>
                <input type="text" name="damages" value={formData.damages} onChange={handleChange} placeholder="Damages" />
                <input type="text" name="room_number" value={formData.room_number} onChange={handleChange} placeholder="Room Number" />
  
        <button onClick={handleInsert}>Insert</button>
        <button onClick={handleUpdate} disabled={!formData.room_id}>Update</button>
        <button onClick={handleDelete} disabled={!formData.room_id}>Delete</button>
  
        {message && <p>{message}</p>}
      </div>
    );
}

export default App;
