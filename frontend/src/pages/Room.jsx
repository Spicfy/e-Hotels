import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Room = () => {
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
        image_url: "",
    });

    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState("");
    const [uploadMsg, setUploadMsg] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleUploadImage = async () => {
        if (!imageFile) return alert("Please select an image first!");

        const uploadData = new FormData();
        uploadData.append("image", imageFile);

        try {
            const res = await axios.post("http://localhost:5000/api/upload", uploadData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const imageUrl = res.data.url;
            setFormData(prev => ({ ...prev, image_url: imageUrl }));
            setUploadMsg("✅ Image uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            setUploadMsg("❌ Failed to upload image.");
        }
    };

    const handleInsert = async () => {
        const form = new FormData();

        // Append text fields
        Object.keys(formData).forEach(key => {
            if (key !== "image_url") {
                form.append(key, formData[key]);
            }
        });

        // Append the actual image file
        if (imageFile) {
            form.append("image", imageFile);
        }

        try {
            const res = await axios.post("http://localhost:5000/api/room", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("✅ Room created successfully!");
            console.log("Created room:", res.data);
        } catch (error) {
            console.error("Insert error:", error);
            setMessage("❌ Failed to create room.");
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/room/${formData.room_id}`, formData);
            setMessage(response.data.message || "✅ Room updated successfully!");
        } catch (error) {
            setMessage("❌ Error updating room.");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/room/${formData.room_id}`);
            setMessage(response.data.message || "✅ Room deleted successfully!");
        } catch (err) {
            setMessage("❌ Error deleting room.");
        }
    };

    return (
        <div className="admin-container">
            <h2 className="page-title">🚪 Manage Rooms</h2>
            <div className="form-container">
                <input type="number" name="room_id" placeholder="Room ID" onChange={handleChange} />
                <input type="number" name="hotel_id" placeholder="Hotel ID" onChange={handleChange} />
                <input type="number" name="price" placeholder="Price" onChange={handleChange} />
                <input type="text" name="amenities" placeholder="Amenities (comma separated)" onChange={handleChange} />
                <input type="number" name="capacity" placeholder="Capacity" onChange={handleChange} />
                <label><input type="checkbox" name="sea_view" onChange={handleChange} /> Sea View</label>
                <label><input type="checkbox" name="extendable" onChange={handleChange} /> Extendable</label>
                <input type="text" name="damages" placeholder="Damages" onChange={handleChange} />
                <input type="text" name="room_number" placeholder="Room Number" onChange={handleChange} />

                {/* Image Upload */}
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                <button onClick={handleUploadImage}>📤 Upload Image</button>
                {uploadMsg && <p className="result-msg">{uploadMsg}</p>}
                {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" style={{ width: "200px", marginTop: "10px" }} />
                )}

                <button onClick={handleInsert}>➕ Insert</button>
                <button onClick={handleUpdate} disabled={!formData.room_id}>🔄 Update</button>
                <button onClick={handleDelete} disabled={!formData.room_id}>🗑️ Delete</button>
                <button className="back-btn" onClick={() => navigate('/admin')}>⬅ Back to Admin</button>

                {message && <p className="result-msg">{message}</p>}
            </div>
        </div>
    );
};

export default Room;