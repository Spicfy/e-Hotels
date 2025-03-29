export default function Navbar() {
    return (
        <nav className="bg-gray-800 text-white px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between">
                <div className="font-bold text-xl">Uotel</div>
                <div className="space-x-4">
                    <a href="#" className="hover:text-gray-400">Home Page</a>
                    <a href="#" className="hover:text-gray-400">Booking Room</a>
                    <a href="#" className="hover:text-gray-400">Placeholder</a>
                    <a href="#" className="hover:text-gray-400">News</a>
                    <a href="#" className="hover:text-gray-400">Contact Us</a>
                </div>
            </div>
        </nav>
    );
}
