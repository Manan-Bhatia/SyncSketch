"use client";
import { useState } from "react";
import axios from "axios";
import { UserObj } from "@/types/userForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
export default function Login() {
    const router = useRouter();
    const [user, setUser] = useState<UserObj>({
        email: "",
        username: "",
        password: "",
    });
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/login", user);
            if (response.status === 200) {
                toast.success(response.data.message, {
                    duration: 2000,
                    position: "bottom-center",
                });
                setTimeout(() => {
                    router.replace("/");
                }, 2000);
            }
        } catch (error: any) {
            toast.error(error.response.data.message, {
                duration: 2000,
                position: "bottom-center",
            });
            console.log("Error in login", error);
        }
    };
    return (
        <>
            <Toaster />
            <h2 className="text-xl md:text-2xl font-semibold mb-1 md:mb-2">
                Login to Your Account:
            </h2>
            <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
                Unlock the power of SynchSketch. Enter your email and password
                below to access your collaborative workspace.
            </p>
            <form
                onSubmit={(e) => handleFormSubmit(e)}
                className="space-y-2 md:space-y-4 mb-4 md:mb-6"
            >
                <div className="relative w-full  flex">
                    <input
                        id="email"
                        className="text-sm md:text-base peer w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 placeholder-transparent"
                        required
                        onChange={(e) =>
                            setUser((prevUser: UserObj) => ({
                                ...prevUser,
                                email: e.target.value,
                            }))
                        }
                        type="text"
                        placeholder="Email"
                        value={user.email}
                    />
                    <label
                        htmlFor="email"
                        className="absolute  text-sm md:text-base peer-placeholder-shown:top-2 left-3 text-gray-600 peer-placeholder-shown:text-gray-400 -top-3 duration-300 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:bg-white bg-white px-1"
                    >
                        Email
                    </label>
                </div>
                <div className="relative flex items-center w-full">
                    <input
                        id="username"
                        className="peer text-sm md:text-base w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 placeholder-transparent"
                        required
                        type="password"
                        autoComplete="off"
                        value={user.password}
                        onChange={(e) =>
                            setUser((prevUser: UserObj) => ({
                                ...prevUser,
                                password: e.target.value,
                            }))
                        }
                        placeholder="Password"
                    />
                    <label
                        className="absolute text-sm md:text-base   peer-placeholder-shown:top-2 left-3 text-gray-600 peer-placeholder-shown:text-gray-400 -top-3 duration-300 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:bg-white bg-white px-1"
                        htmlFor="username"
                    >
                        Password
                    </label>
                </div>
                <button
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-blue-600"
                    type="submit"
                >
                    Login
                </button>
            </form>
            <div className="w-full flex justify-between items-start">
                <h4 className="text-base md:text-lg font-normal mb-0 md:mb-2">
                    Forgot Your Password?
                </h4>
                <Link
                    className="text-blue-500 text-sm md:text-base hover:underline whitespace-nowrap"
                    href="/resetPassword"
                >
                    Reset password
                </Link>
            </div>
            <div className="w-full flex justify-between items-start">
                <h4 className="text-base md:text-lg font-normal mb-0 md:mb-2">
                    New to SyncSkecth?
                </h4>
                <Link
                    className="text-blue-500 text-sm md:text-base hover:underline"
                    href="/signup"
                >
                    Signup{" "}
                </Link>
            </div>
        </>
    );
}
