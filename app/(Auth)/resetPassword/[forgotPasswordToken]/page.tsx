"use client";
import { useState } from "react";
import { ResetPasswordObj } from "@/types/resetPasswordForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
export default function ResetPassword({
    params,
}: {
    params: {
        forgotPasswordToken: string;
    };
}) {
    const router = useRouter();
    const [formData, setFormData] = useState<ResetPasswordObj>({
        confirmPassword: "",
        password: "",
        forgotPasswordToken:
            decodeURIComponent(params.forgotPasswordToken) || "",
    });
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.put("/api/resetpassword", formData);
            if (response.status === 200) {
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
            console.log("Error in reset password", error);
        }
    };

    return (
        <>
            <Toaster />
            <h2 className="text-xl md:text-2xl font-semibold mb-1 md:mb-2">
                Reset Your Password
            </h2>
            <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
                Enter your new password below to reset your account password.
            </p>
            <form
                className="space-y-2 md:space-y-4 mb-4 md:mb-6"
                onSubmit={(e) => handleFormSubmit(e)}
            >
                <div className="w-full relative flex">
                    <input
                        id="password"
                        required
                        className="text-sm md:text-base peer w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 placeholder-transparent"
                        onChange={(e) =>
                            setFormData((prev: ResetPasswordObj) => ({
                                ...prev,
                                password: e.target.value,
                            }))
                        }
                        type="password"
                        value={formData.password}
                        placeholder="Password"
                    />
                    <label
                        className="absolute  text-sm md:text-base peer-placeholder-shown:top-2 left-3 text-gray-600 peer-placeholder-shown:text-gray-400 -top-3 duration-300 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:bg-white bg-white px-1"
                        htmlFor="password"
                    >
                        Password
                    </label>
                </div>
                <div className="flex relative w-full">
                    <input
                        id="confirmPassword"
                        className="text-sm md:text-base peer w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 placeholder-transparent"
                        required
                        onChange={(e) =>
                            setFormData((prev: ResetPasswordObj) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                            }))
                        }
                        type="password"
                        value={formData.confirmPassword}
                        placeholder="Re enter password"
                    />
                    <label
                        className="absolute  text-sm md:text-base peer-placeholder-shown:top-2 left-3 text-gray-600 peer-placeholder-shown:text-gray-400 -top-3 duration-300 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:bg-white bg-white px-1"
                        htmlFor="confirmPassword"
                    >
                        Re enter password
                    </label>
                </div>
                <button
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-blue-600"
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </>
    );
}
