"use client";
import { useState } from "react";
import axios from "axios";
import { UserObj } from "@/types/userForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function ResetPassword() {
    const router = useRouter();
    const [user, setUser] = useState<UserObj>({
        email: "",
        username: "",
        password: "",
    });
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/resetpassword", user);
            if (response.status === 200) router.replace("/login");
        } catch (error) {
            console.log("Error in reset password", error);
        }
    };
    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={(e) => handleFormSubmit(e)}>
                <label htmlFor="email">Email</label>
                <input
                    required
                    onChange={(e) =>
                        setUser((prevUser: UserObj) => ({
                            ...prevUser,
                            email: e.target.value,
                        }))
                    }
                    className="border-2"
                    type="text"
                    value={user.email}
                />
                <button type="submit">Submit</button>
                <Link href="/login">Login here</Link>
            </form>
        </div>
    );
}
