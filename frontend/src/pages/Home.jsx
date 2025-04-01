// frontend/src/pages/Home.js
import Navbar from "../components/Navbar";
import "../App.css";

const Home = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="App">
            <Navbar />
            <header className="App-header">
                <h1>Welcome to e-Hotels 🏨</h1>
                <p>Your perfect solution for managing hotel bookings effortlessly.</p>

                <div className="menu-container">
                    <a className="menu-link" href="/rooms">View Available Rooms 🔍</a>
                    <a className="menu-link" href="/sign-up">Customer Sign up 👤</a>
                    <a className="menu-link" href="/employee-sign-up">Employee Sign up 🛎️</a>
                    {/* Logged-in Employee Only */}
                    {user && user.role === "Employee" && (
                        <a className="menu-link" href="/manage-bookings">Admin Page 🛠️</a>
                    )}
                    <a className="menu-link" href="/totalrooms">Total Capacity by Hotel 📈</a>
                    <a className="menu-link" href="/roomsbyarea">Total Capacity by Area 🌍</a>

                    {/* Logged-in Customer Only */}
                    {user && user.role === "Customer" && (
                        <a className="menu-link" href="/mystatus">📋 My Booking Status</a>
                    )}

                    {/* Logged-in Employee Only */}
                    {user && user.role === "Employee" && (
                        <a className="menu-link" href="/manage-bookings">🧾 Manage Orders</a>
                    )}
                </div>
            </header>
        </div>
    );
};

export default Home;