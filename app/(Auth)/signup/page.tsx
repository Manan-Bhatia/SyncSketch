"use client";
import { useState } from "react";
import axios from "axios";
import { UserObj } from "@/types/userForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
            if (response.status === 201) router.push("/login");
        } catch (error) {
            console.log("Error in signup", error);
        }
    };
    return (
        <div>
            <h1>Signup</h1>
            <form onSubmit={(e) => handleFormSubmit(e)}>
                <label htmlFor="username">Username</label>
                <input
                    required
                    onChange={(e) =>
                        setUser((prevUser: UserObj) => ({
                            ...prevUser,
                            username: e.target.value,
                        }))
                    }
                    className="border-2"
                    type="text"
                    value={user.username}
                />
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
                <label htmlFor="username">Password</label>
                <input
                    required
                    className="border-2"
                    type="password"
                    autoComplete="off"
                    value={user.password}
                    onChange={(e) =>
                        setUser((prevUser: UserObj) => ({
                            ...prevUser,
                            password: e.target.value,
                        }))
                    }
                />
                <button type="submit">Signup</button>
                <Link href="/login">Login here</Link>
            </form>
        </div>
    );
}
