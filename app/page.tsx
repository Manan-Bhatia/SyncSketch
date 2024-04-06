"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import logo from "../public/logo.svg";
import { BsThreeDots } from "react-icons/bs";
import { WhiteBoardFields } from "@/types/WhiteboardFields";
import { MdOutlineAdd } from "react-icons/md";
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
    // user
    const [user, setUser] = useState<{
        id: string;
        username: string;
    }>();
    useEffect(() => {
        getUserDetails();
    }, []);
    const getUserDetails = async () => {
        try {
            const res = await axios.get("/api/user");
            setUser(res.data);
        } catch (error) {
            console.log("Error getting user details", error);
        }
    };
    // profile option visible
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    // delete option visible
    const [deleteOptionVisible, setDeleteOptionVisible] =
        useState<boolean>(false);
    // currently selected
    const [currentlySelected, setCurrentlySelected] =
        useState<WhiteBoardFields | null>(null);
    // extra menu visible
    const extraMenuRefs = useRef<(HTMLDivElement | null)[]>([]);
    return (
        <>
            {deleteOptionVisible && currentlySelected && (
                <div className="absolute bg-black/40 w-full h-full inset-0 z-50 flex items-center justify-center">
                    <div className="bg-white z-50 p-3 rounded-lg flex flex-col items-center gap-2 w-11/12">
                        <h2>Delete?</h2>
                        <p className="break-words text-center capitalize">
                            Are you sure you want to delete "
                            {currentlySelected.title}"?
                        </p>
                        <div className="w-full flex justify-between">
                            <button
                                onClick={() => {
                                    setCurrentlySelected(null);
                                    setDeleteOptionVisible(
                                        !deleteOptionVisible
                                    );
                                }}
                                className="w-1/3 text-white rounded-md bg-slate-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(currentlySelected._id);
                                    setCurrentlySelected(null);
                                    setDeleteOptionVisible(false);
                                }}
                                className="bg-red-500 text-white p-2 w-1/3 rounded-md"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <section className="flex flex-col p-3 h-full relative">
                <header className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Image
                                alt="Logo"
                                src={logo}
                                className="w-full h-auto"
                            />
                        </div>
                        <h1 className="text-xl font-medium md:text-2xl md:font-bold lg:text-3xl">
                            Sync Sketch
                        </h1>
                    </div>
                    <div
                        onClick={() => setDropdownVisible(!dropdownVisible)}
                        className={
                            (dropdownVisible
                                ? "aspect-auto "
                                : "aspect-square hover:aspect-auto ") +
                            "cursor-pointer relative bg-black group rounded-full h-4 p-4 flex items-center justify-center " +
                            "md:aspect-auto"
                        }
                    >
                        {user && (
                            <>
                                <span
                                    className={
                                        dropdownVisible
                                            ? " text-white capitalize hidden "
                                            : " text-white capitalize block group-hover:hidden " +
                                              "md:hidden"
                                    }
                                >
                                    {user.username.slice(0, 1)}
                                </span>
                                <span
                                    className={
                                        dropdownVisible
                                            ? " text-white capitalize block "
                                            : " text-white capitalize hidden group-hover:block " +
                                              "md:block"
                                    }
                                >
                                    {user.username}
                                </span>
                            </>
                        )}

                        {dropdownVisible && (
                            <div className="absolute right-0 -bottom-28 drop-shadow-xl bg-white p-3 flex flex-col gap-2 rounded-md w-full z-50">
                                <p className="hover:underline">Profile</p>
                                <hr />
                                <button
                                    className="hover:underline"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                <main className="py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 h-full grid-rows-3 place-items-stretch place-content-stretch">
                    <button
                        className="border-black border-2 border-dashed flex flex-col items-center p-2"
                        onClick={handleCreate}
                    >
                        <div className="flex-1 w-full flex items-center justify-center">
                            <MdOutlineAdd size={48} />
                        </div>
                        <h3>Create</h3>
                    </button>
                    {whiteboards && (
                        <>
                            {whiteboards.map((whiteboard: any, index) => (
                                <div
                                    onClick={() =>
                                        router.push(
                                            `/whiteboard/${whiteboard._id}`
                                        )
                                    }
                                    key={whiteboard._id}
                                    className="cursor-pointer rounded-md drop-shadow-md bg-white relative p-2 flex flex-col items-between"
                                >
                                    <BsThreeDots
                                        size={20}
                                        className="self-end"
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            extraMenuRefs.current[
                                                index
                                            ]?.classList.toggle("flex");
                                            extraMenuRefs.current[
                                                index
                                            ]?.classList.toggle("hidden");
                                            setCurrentlySelected(whiteboard);
                                        }}
                                    />
                                    <div
                                        ref={(ele) =>
                                            (extraMenuRefs.current[index] = ele)
                                        }
                                        className="absolute p-2 rounded-md drop-shadow-xl bg-white flex-col gap-2 items-start right-2 top-8 hidden"
                                    >
                                        <button>Add To Favourites</button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentlySelected(
                                                    whiteboard
                                                );
                                                setDeleteOptionVisible(true);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    {/* thumbnail */}
                                    <div className="flex-1"></div>
                                    {/* title */}
                                    <div className="flex items-center justify-center">
                                        <h3 className="break-words text-center">
                                            {whiteboard.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </main>
            </section>
        </>
    );
}
