// frontend/src/pages/Home.js
import Navbar from "../components/Navbar";
import "../App.css";

const Home = () => {
    return (
        <div className="App">
            <Navbar />
            <div className="home-container">
                <h1>Welcome to e-Hotels 🏨</h1>
                <p>Your perfect solution for managing hotel bookings effortlessly.</p>

                <div className="menu-container">
                    <a className="menu-link" href="/rooms">View Available Rooms 🔍</a>
                    <a className="menu-link" href="/sign-up">Customer Sign up 👤</a>
                    <a className="menu-link" href="/employee-sign-up">Employee Sign up 🛎️</a>
                    <a className="menu-link" href="/admin">Admin Page 🛠️</a>
                    <a className="menu-link" href="/totalrooms">Total Capacity by Hotel 📈</a>
                    <a className="menu-link" href="/roomsbyarea">Total Capacity by Area 🌍</a>
                </div>
            </div>
        </div>
    );
};

export default Home;
