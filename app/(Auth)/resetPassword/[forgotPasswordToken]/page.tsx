"use client";
import { useState } from "react";
import { ResetPasswordObj } from "@/types/resetPasswordForm";
import axios from "axios";
import { useRouter } from "next/navigation";
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
                router.push("/login");
            }
        } catch (error: any) {
            console.log("Error in reset password", error);
        }
    };

    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={(e) => handleFormSubmit(e)}>
                <label htmlFor="password"> Password</label>
                <input
                    id="password"
                    required
                    onChange={(e) =>
                        setFormData((prev: ResetPasswordObj) => ({
                            ...prev,
                            password: e.target.value,
                        }))
                    }
                    className="border-2"
                    type="password"
                    value={formData.password}
                />
                <label htmlFor="confirmPassword">Re enter password</label>
                <input
                    id="confirmPassword"
                    required
                    onChange={(e) =>
                        setFormData((prev: ResetPasswordObj) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                        }))
                    }
                    className="border-2"
                    type="password"
                    value={formData.confirmPassword}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
