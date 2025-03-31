import React, {useState, useEffect} from 'react';

import axios from 'axios';

function BookingForm() {
    const [customer_id, setCustomerId] = useState('');
    const [room_id, setRoomId] = useState('');
    const [check_in_date, setCheckInDate] = useState('');
    const [ check_out_date, setCheckOutDate] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            const response = await axios.post('http://localhost:3000/api/bookings', {
                customer_id: customer_id,
                room_id: room_id,
                check_in_date: check_in_date,
                check_out_date: check_out_date,
            });
            setMessage(response.data.message);
            console.log(response.data);
        } catch(error){
            setMessage(`Error: ${error.response.data.message}`);
        }
    };

    return (
        <div>
            <h2>Create Booking</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Customer ID:</label>
                    <input 
                    type="number"
                    value={customer_id}
                    onChange={(e)=> setCustomerId(e.target.value)}
                    required
                     />
                </div>
                <div>
                    <label>Room ID:</label>
                    <input 
                    type="number"
                    value={room_id}
                    onChange={(e) => setRoomId(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label>Check-in Date:</label>
                    <input type="date"
                    value={check_in_date}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                    />
                </div>
                <button type="submimt">Create Booking</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}
export default BookingForm;