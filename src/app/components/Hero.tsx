export default function Hero() { //Search & Book Mechanic
    return (
        <div className="bg-cover bg-center h-[400px]" style={{backgroundImage: `url('/hotel.jpg')`}}>
            <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold">Welcome to Project Uotel</h1>
                    <p className="mt-2">Enjoy your confortable and cozy Ottawa Trip</p>

                    <div className="mt-6 bg-white bg-opacity-80 rounded-lg p-4 inline-block">
                        <form className="flex gap-2">
                            <input type="date" className="px-2 py-1 rounded text-black" required/>
                            <input type="date" className="px-2 py-1 rounded text-black" required/>
                            <input type="number" placeholder="People" className="px-2 py-1 rounded w-20 text-black" required/>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Search</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
