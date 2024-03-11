"use client";
import { useState } from "react";
import axios from "axios";
import { UserObj } from "@/types/userForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
export default function Signup() {
    const router = useRouter();
    const [user, setUser] = useState<UserObj>({
        email: "",
        username: "",
        password: "",
    });
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/signup", user);
            if (response.status === 201) {
                toast.success(response.data.message, {
                    duration: 2000,
                    position: "bottom-center",
                });
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        } catch (error: any) {
            toast.error(error.response.data.message, {
                duration: 2000,
                position: "bottom-center",
            });
            console.log("Error in signup", error);
        }
    };
    return (
        <>
            <Toaster />
            <h2 className="text-xl md:text-2xl font-semibold mb-1 md:mb-2">
                Joint SyncSketch
            </h2>
            <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
                Unlock the collaborative power of SynchSketch! Create your
                account and start sketching together.
            </p>
            <form
                className="space-y-2 md:space-y-4 mb-4 md:mb-6"
                onSubmit={(e) => handleFormSubmit(e)}
            >
                <div className="w-full relative flex">
                    <input
                        id="username"
                        className="text-sm md:text-base peer w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 placeholder-transparent"
                        required
                        onChange={(e) =>
                            setUser((prevUser: UserObj) => ({
                                ...prevUser,
                                username: e.target.value,
                            }))
                        }
                        type="text"
                        placeholder="Username"
                        value={user.username}
                    />
                    <label
                        className="absolute  text-sm md:text-base peer-placeholder-shown:top-2 left-3 text-gray-600 peer-placeholder-shown:text-gray-400 -top-3 duration-300 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:bg-white bg-white px-1"
                        htmlFor="username"
                    >
                        Username
                    </label>
                </div>
                <div className="w-full relative flex">
                    <input
                        required
                        className="text-sm md:text-base peer w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 placeholder-transparent"
                        onChange={(e) =>
                            setUser((prevUser: UserObj) => ({
                                ...prevUser,
                                email: e.target.value,
                            }))
                        }
                        type="text"
                        value={user.email}
                        placeholder="Email"
                        id="email"
                    />
                    <label
                        className="absolute  text-sm md:text-base peer-placeholder-shown:top-2 left-3 text-gray-600 peer-placeholder-shown:text-gray-400 -top-3 duration-300 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:bg-white bg-white px-1"
                        htmlFor="email"
                    >
                        Email
                    </label>
                </div>
                <div className="w-full relative flex">
                    <input
                        required
                        type="password"
                        className="text-sm md:text-base peer w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 placeholder-transparent"
                        autoComplete="off"
                        value={user.password}
                        onChange={(e) =>
                            setUser((prevUser: UserObj) => ({
                                ...prevUser,
                                password: e.target.value,
                            }))
                        }
                        placeholder="Password"
                        id="password"
                    />
                    <label
                        className="absolute  text-sm md:text-base peer-placeholder-shown:top-2 left-3 text-gray-600 peer-placeholder-shown:text-gray-400 -top-3 duration-300 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:bg-white bg-white px-1"
                        htmlFor="username"
                    >
                        Password
                    </label>
                </div>
                <button
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-blue-600"
                    type="submit"
                >
                    Signup
                </button>
            </form>
            <div className="w-full flex justify-between items-start">
                <h4 className="text-base md:text-lg font-normal mb-0 md:mb-2">
                    Already have an account?
                </h4>
                <Link
                    className="text-blue-500 text-sm md:text-base hover:underline whitespace-nowrap"
                    href="/login"
                >
                    Login
                </Link>
            </div>
        </>
    );
}
