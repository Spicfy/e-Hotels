
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) router.push("/authentication/login");
        else alert((await res.json()).message);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="bg-blue-900 p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="bg-blue-900 text-2xl font-bold mb-6 text-center">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-4 text-sm text-center ">
                    Already have an account?{" "}
                    <Link href="/authentication/login" className="text-red-600 hover:underline">
                        Login Now!
                    </Link>
                </p>
            </div>
        </div>
    );
}
