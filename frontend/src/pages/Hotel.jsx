import React, { useState } from "react";
import axios from "axios";
import Employee from "./Employee";

const Hotel = () => {
    const [formData, setFormData] = useState({
        hotel_id: "",
        chain_id: "",
        name: "",
        stars: "",
        address: "",
        contact_email: "",
        contact_phone: "",
        employee_id: "",
        
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
  
    const handleInsert = async () => {
      try {
          const response = await axios.post(
              "http://localhost:3000/api/hotel",
              formData,
              {
                headers: { "Content-Type": "application/json" },
              }
            );
  
       
        setMessage(response.data.message || "Hotel added successfully!");
      } catch (error) {
        setMessage("Error adding Hotel.");
      }
    };
  
    const handleUpdate = async () => {
      try {
          const response = await axios.put(
              `http://localhost:3000/api/hotel/${formData.hotel_id}`,
              {
               hotel_id: formData.hotel_id,
               employee_id: formData.employee_id,
                chain_id: formData.chain_id,
                name: formData.name,
                stars: formData.stars,
                address: formData.address,
                contact_email: formData.contact_email,
                contact_phone: formData.contact_phone,
                
              },
              {
                headers: { "Content-Type": "application/json" },
              }
            );
            
       
        setMessage(response.data.message || "Hotel updated successfully!");
      } catch (error) {
        setMessage("Error updating Hotel.");
      }
    };
  
    // Delete a customer by customer_id
    const handleDelete = async () => {
      try {
          const response = await axios.delete(
              `http://localhost:3000/api/hotel/${formData.hotel_id}`
            );
            
        setMessage(response.data.message || "Hotel deleted successfully!");
      } catch (err) {
        setMessage("Error deleting hotel.");
      }
    };
  
    return (
      <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
        <h2>Manage Hotel</h2>
        <input type="number" placeholder="Hotel Id" name="hotel_id" onChange={handleChange} />
        <input type="number" placeholder="Employee Id" name="employee_id" onChange={handleChange} />
        <input type="number" placeholder="Chain_id" name="chain_id" onChange={handleChange} />
        <input type="text" placeholder="Hotel Name" name="name" onChange={handleChange} />
        <input type="number" placeholder="Stars" name="stars" onChange={handleChange} />
        <input type="text" placeholder="Address" name="address" onChange={handleChange} />
        <input type="text" placeholder="Contact Email" name="contact_email" onChange={handleChange} />
        <input type="text" placeholder="Contact Phone" name="contact_phone" onChange={handleChange} />
        <button onClick={handleInsert}>Insert</button>
        <button onClick={handleUpdate} disabled={!formData.hotel_id}>Update</button>
        <button onClick={handleDelete} disabled={!formData.hotel_id}>Delete</button>
  
        {message && <p>{message}</p>}
      </div>
    );
}

export default Hotel;