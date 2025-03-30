import Image from "next/image";
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RoomCard from './components/RoomCard';
import Footer from './components/Footer';
// Main Page
export default function Home() {
  return (
      <div>
        <Navbar />
        <Hero />

        <section className="py-10 px-4">
          <h2 className="text-2xl font-bold text-center">Featured Room Types</h2>
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <RoomCard title="Luxury Double Bed" description="Comfortable hotel experiment" price={288} imageUrl="/double_bed_rood_1.png" />
            <RoomCard title="Suite" description="Bussiness Option" price={488} imageUrl="/suite_1.png" />
            <RoomCard title="Classic King Sized Bed" description="Budget Option" price={188} imageUrl="/king_sized_room_1.png" />
          </div>
        </section>

        <Footer />
      </div>
  );
}