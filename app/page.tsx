"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
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
    const handleCreate = async () => {
        try {
            const res = await axios.post("/api/whiteboard/create");
            await getWhiteboards();
            router.push(`/whiteboard/${res.data.id}`);
        } catch (error) {
            console.log("Error creating new whiteboard", error);
        }
    };
    // whiteboards
    const [whiteboards, setWhiteboards] = useState<[]>();
    useEffect(() => {
        getWhiteboards();
    }, []);
    const getWhiteboards = async () => {
        try {
            const res = await axios.get("/api/whiteboard/getall");
            setWhiteboards(res.data);
        } catch (error) {
            console.log("Error in getting whiteboards", error);
        }
    };
    // delete
    const handleDelete = async (id: string) => {
        try {
            await axios.delete("/api/whiteboard/delete", {
                data: { id },
            });
            await getWhiteboards();
        } catch (error) {
            console.log("Error in deleting whiteboard", error);
        }
    };
    return (
        <>
            <h1>Home Dashboard</h1>
            <button onClick={logout}>Logout</button>
            <button onClick={handleCreate}>Create</button>
            {whiteboards && (
                <div>
                    {whiteboards.map((whiteboard: any) => (
                        <div key={whiteboard._id} className="flex">
                            <h3>{whiteboard.title}</h3>
                            <button
                                onClick={() =>
                                    router.push(`/whiteboard/${whiteboard._id}`)
                                }
                            >
                                Open
                            </button>
                            <button
                                onClick={() => handleDelete(whiteboard._id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
