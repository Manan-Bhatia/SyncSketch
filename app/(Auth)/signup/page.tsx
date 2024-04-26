"use client";
import { useState } from "react";
import axios from "axios";
import { UserObj } from "@/types/userForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiMiniEye, HiMiniEyeSlash } from "react-icons/hi2";
export default function Signup() {
    const router = useRouter();
    const signUpSchema = z.object({
        email: z.string().min(1, "Email is required").email("Invalid email"),
        username: z
            .string()
            .min(3, "Username should be atleast 3 characters")
            .max(50, "Username should be less than 50 characters")
            .refine(
                (val) => {
                    return /^[a-zA-Z0-9]+$/.test(val);
                },
                {
                    message: "Username should only contain letters and numbers",
                }
            ),
        password: z
            .string()
            .min(1, "Password is required")
            .min(5, "Password must have more than 5 characters")
            .refine(
                (val) => {
                    return (
                        /[a-z]/.test(val) &&
                        /[A-Z]/.test(val) &&
                        /\d/.test(val) &&
                        /[!@#$%^&*]/.test(val)
                    );
                },
                {
                    message:
                        "Password must have at least 1 uppercase, 1 lowercase, 1 number and atleast 1 special character",
                }
            ),
    });
    type SignUpSchemaType = z.infer<typeof signUpSchema>;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpSchemaType>({ resolver: zodResolver(signUpSchema) });
    const handleFormSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
        try {
            const response = await axios.post("/api/signup", data);
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
        }
    };
    const [showPassword, setShowPassword] = useState<boolean>(false);
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
                onSubmit={handleSubmit(handleFormSubmit)}
            >
                <div className="w-full relative flex flex-col">
                    <input
                        id="username"
                        className="text-sm md:text-base peer w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 placeholder-transparent"
                        {...register("username")}
                        placeholder="Username"
                        autoComplete="username"
                    />
                    <label
                        className="absolute  text-sm md:text-base peer-placeholder-shown:top-2 left-3 text-gray-600 peer-placeholder-shown:text-gray-400 -top-3 duration-300 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:bg-white bg-white px-1"
                        htmlFor="username"
                    >
                        Username
                    </label>
                </div>
                {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.username.message}
                    </p>
                )}
                <div className="w-full relative flex flex-col">
                    <input
                        className="text-sm md:text-base peer w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 placeholder-transparent"
                        placeholder="Email"
                        {...register("email")}
                        id="email"
                        autoComplete="email"
                    />
                    <label
                        className="absolute  text-sm md:text-base peer-placeholder-shown:top-2 left-3 text-gray-600 peer-placeholder-shown:text-gray-400 -top-3 duration-300 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:bg-white bg-white px-1"
                        htmlFor="email"
                    >
                        Email
                    </label>
                </div>
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                    </p>
                )}
                <div className="w-full relative flex flex-col justify-center">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="text-sm md:text-base peer w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 placeholder-transparent"
                        {...register("password")}
                        placeholder="Password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <label
                        className="absolute  text-sm md:text-base peer-placeholder-shown:top-2 left-3 text-gray-600 peer-placeholder-shown:text-gray-400 -top-3 duration-300 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:bg-white bg-white px-1"
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
