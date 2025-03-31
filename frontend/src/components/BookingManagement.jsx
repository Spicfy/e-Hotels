import React, {useState, useEffect} from 'react';
import axios from 'axios';

function BookingManagement({employeeId}){
    const [bookings, setBookings] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(()=> {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try{
            const response = await axios.get('http://localhost:3000/api/bookings');
            setBookings(response.data);
        }catch(error){
            setMessage(`Error fetching bookings: ${error.response?.data?.message || error.message}`);
        }
    }

    const handleConvertBooking = async () => {
        if(!selectedBookingId){
            setMessage('Please select a booking to convert.');
            return;
        }
        try{
            const response = await axios.post('http://localhost:3000/api/rentals/convert', {
                booking_id: selectedBookingId,
                employee_id: employeeId
            });
            setMessage(response.data.message);
            fetchBookings(); //Refresh the booking list after conversion
        }catch(error){
            setMessage(`Error converting booking: ${error.response?.data?.message || error.message}`);
        }
    };

    return(
        <div>
            <h2>Booking Management</h2>
            {message && <p>{message} </p>}
            <ul>
                {bookings.map((booking) => (
                    <li key={booking.booking_id}>
                        Booking ID: {booking.booking_id}, Customer ID:
                        {booking.customer_id}, Room ID: {bookingroom_id}, Status: {booking.status}
                        <input type="radio"
                        name="bookingSelection"
                        value={booking.booking_id}
                        onChange={(e) => 
                            setSelectedBookingId(parseInt(e.target.value))
                        }
                        />
                    </li>
                ))}
            </ul>
            <button onClick={handleConvertBooking}>Convert Selected Booking to Rental</button>
        </div>
    )

}
export default BookingManagement;