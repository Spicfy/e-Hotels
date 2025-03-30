import React, { useState } from "react";
import axios from "axios";
const Employee = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    address: "",
    ssn_sin: "",
    hotel_id: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Insert a new employee
  const handleInsert = async () => {
    try {
        const response = await axios.post(
            "http://localhost:3000/api/employee",
            formData,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

     
      setMessage(response.data.message || "Employee added successfully!");
    } catch (error) {
      setMessage("Error adding employee.");
    }
  };

  const handleUpdate = async () => {
    try {
        const response = await axios.put(
            `http://localhost:3000/api/employee/${formData.employee_id}`,
            {
              full_name: formData.full_name,
              password: formData.password,
              address: formData.address,
              ssn_sin: formData.ssn_sin,
                hotel_id: formData.hotel_id,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          
     
      setMessage(response.data.message || "Employee updated successfully!");
    } catch (error) {
      setMessage("Error updating Employee.");
    }
  };

  // Delete a customer by customer_id
  const handleDelete = async () => {
    try {
        const response = await axios.delete(
            `http://localhost:3000/api/employee/${formData.employee_id}`
          );
          
      setMessage(response.data.message || "employee deleted successfully!");
    } catch (err) {
      setMessage("Error deleting employee.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Manage employee</h2>
      <input type="number" name="employee_id" placeholder="Employee ID (for update/delete)" value={formData.customer_id} onChange={handleChange} />
      <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
      <input type="text" name="ssn_sin" placeholder="SSN/SIN" value={formData.ssn_sin} onChange={handleChange} />
      <input type="number" placeholder="Hotel Id"name="hotel_id" value={formData.hotel_id} onChange={handleChange} />

      <button onClick={handleInsert}>Insert</button>
      <button onClick={handleUpdate} disabled={!formData.employee_id}>Update</button>
      <button onClick={handleDelete} disabled={!formData.employee_id}>Delete</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Employee;
