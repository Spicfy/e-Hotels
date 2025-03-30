"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const res = await signIn("credentials", {
            redirect: false,
            email: form.email,
            password: form.password,
        });

        if (res?.ok) {
            router.push("/");
        } else {
            alert("Login failed. Please check your email and password.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="bg-blue-900 p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center text-white">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        Login
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-white">
                    Don’t have an account?{" "}
                    <Link href="/authentication/register" className="text-red-600 hover:underline">
                        Register Now!
                    </Link>
                </p>
            </div>
        </div>
    );
}
