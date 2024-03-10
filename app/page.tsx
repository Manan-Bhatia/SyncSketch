"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
export default function Home() {
    const router = useRouter();
    const logout = async () => {
        try {
            await axios.get("/api/logout");
            router.push("/login");
        } catch (error) {
            console.log("Error in logout", error);
        }
    };
    return (
        <>
            <h1>Home</h1>
            <button onClick={logout}>Logout</button>
        </>
    );
}
