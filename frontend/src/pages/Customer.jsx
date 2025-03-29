import React, { useState } from "react";

const Customer = () => {
  const [formData, setFormData] = useState({
    customer_id: "",
    full_name: "",
    password: "",
    address: "",
    id_type: "",
    registration: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Insert a new customer
  const handleInsert = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setMessage(result.message || "Customer added successfully!");
    } catch (error) {
      setMessage("Error adding customer.");
    }
  };

  // Update an existing customer (except customer_id)
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/customer/${formData.customer_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          password: formData.password,
          address: formData.address,
          id_type: formData.id_type,
          registration: formData.registration,
        }),
      });

      const result = await response.json();
      setMessage(result.message || "Customer updated successfully!");
    } catch (error) {
      setMessage("Error updating customer.");
    }
  };

  // Delete a customer by customer_id
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/customer/${formData.customer_id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      setMessage(result.message || "Customer deleted successfully!");
    } catch (error) {
      setMessage("Error deleting customer.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Manage Customers</h2>
      <input type="number" name="customer_id" placeholder="Customer ID (for update/delete)" value={formData.customer_id} onChange={handleChange} />
      <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
      <input type="text" name="id_type" placeholder="ID Type (SSN, SIN, etc.)" value={formData.id_type} onChange={handleChange} />
      <input type="date" name="registration" value={formData.registration} onChange={handleChange} />

      <button onClick={handleInsert}>Insert</button>
      <button onClick={handleUpdate} disabled={!formData.customer_id}>Update</button>
      <button onClick={handleDelete} disabled={!formData.customer_id}>Delete</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Customer;
