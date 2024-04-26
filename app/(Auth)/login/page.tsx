"use client";
import { useState } from "react";
import axios from "axios";
import { UserObj } from "@/types/userForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiMiniEye, HiMiniEyeSlash } from "react-icons/hi2";

export default function Login() {
    const router = useRouter();
    const loginSchema = z.object({
        email: z.string().min(1, "Email is required").email("Invalid email"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(5, "Password must have more than 5 characters"),
    });
    type LoginSchemaType = z.infer<typeof loginSchema>;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaType>({ resolver: zodResolver(loginSchema) });

    const [user, setUser] = useState<UserObj>({
        email: "",
        username: "",
        password: "",
    });
    const handleFormSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
        try {
            const response = await axios.post("/api/login", data);
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
        }
    };
    const [showPassword, setShowPassword] = useState<boolean>(false);
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
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-2 md:space-y-4 mb-4 md:mb-6"
            >
                <div className="relative w-full  flex flex-col">
                    <input
                        id="email"
                        className="text-sm md:text-base peer w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 placeholder-transparent"
                        {...register("email")}
                        placeholder="Email"
                        autoComplete="email"
                    />
                    <label
                        htmlFor="email"
                        className="absolute  text-sm md:text-base peer-placeholder-shown:top-2 left-3 text-gray-600 peer-placeholder-shown:text-gray-400 -top-3 duration-300 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:bg-white bg-white px-1"
                    >
                        Email
                    </label>
                </div>
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                    </p>
                )}
                <div className="relative flex w-full flex-col justify-center">
                    <input
                        id="username"
                        className="peer text-sm md:text-base w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 placeholder-transparent"
                        {...register("password")}
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                    />
                    <label
                        className="absolute text-sm md:text-base   peer-placeholder-shown:top-2 left-3 text-gray-600 peer-placeholder-shown:text-gray-400 -top-3 duration-300 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:bg-white bg-white px-1"
                        htmlFor="username"
                    >
                        Password
                    </label>
                    {showPassword ? (
                        <HiMiniEye
                            size={24}
                            className="absolute right-4"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    ) : (
                        <HiMiniEyeSlash
                            size={24}
                            className="absolute right-4"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    )}
                </div>
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                    </p>
                )}
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
