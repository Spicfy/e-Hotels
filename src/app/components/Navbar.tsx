'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-gray-800 text-white px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Company Name */}
                <div className="font-bold text-xl">Uotel</div>

                {/* Navigations */}
                <div className="space-x-4">
                    <Link href="/" className="hover:text-gray-400">Home Page</Link>
                    <Link href="/booking" className="hover:text-gray-400">Booking Room</Link>
                    <Link href="#" className="hover:text-gray-400">Placeholder</Link>
                    <Link href="#" className="hover:text-gray-400">Placeholder</Link>
                    <Link href="/news" className="hover:text-gray-400">News</Link>
                    <Link href="/contact" className="hover:text-gray-400">Contact Us</Link>

                    {/* display based on login status */}
                    {session ? (
                        <>
                            <span className="ml-4">Welcome, {session.user?.name}</span>
                            <button onClick={() => signOut()} className="hover:text-gray-400 ml-2">Logout</button>
                        </>
                    ) : (
                        <Link href="/authentication/register" className="hover:text-gray-400">Login/Register</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
