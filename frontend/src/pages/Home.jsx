import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import BookingForm from "../components/BookingForm";

const Home = () => {
    const [showForm, setShowForm] = useState(false); // Initialize state to false

    const handleButtonClick = () => {
        setShowForm(true); // Set state to true when button is clicked
    };

    return (
        <div>
            <Navbar />
            {showForm ? (
                <BookingForm />
            ) : (
                <button onClick={handleButtonClick}>New booking</button>
            )}
        </div>
    );
};

export default Home;