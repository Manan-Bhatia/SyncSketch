"use client";
import { DrawAction } from "@/helpers/canvasHelper";
import dynamic from "next/dynamic";
import { ReactNode, useEffect, useRef, useState } from "react";
const Canvas = dynamic(() => import("@/components/canvas"), { ssr: false });
import { Toaster, toast } from "react-hot-toast";
import {
    FaPencilAlt,
    FaRegCircle,
    FaRegSquare,
    FaEraser,
    FaRegBookmark,
    FaBookmark,
    FaTrashAlt,
    FaEdit,
    FaCheck,
    FaSave,
    FaMousePointer,
} from "react-icons/fa";
import { FaArrowPointer } from "react-icons/fa6";
import { HexColorPicker } from "react-colorful";
import axios from "axios";
import { io, Socket } from "socket.io-client";
export default function Whiteboard({ params }: { params: { id: string } }) {
    const parent = useRef<HTMLDivElement>(null);
    const brushBar = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<{
        width: number;
        height: number;
    }>({
        width: 1,
        height: 1,
    });
    // get whiteboard details
    const getWhiteboard = async () => {
        try {
            const res = await axios.post("/api/whiteboard/get", {
                id: params.id,
            });
            setWhiteboardTitle(res.data.title);
            setColorSwatch(res.data.drawingData.colors);
        } catch (error) {
            console.log("Error in getting whiteboard", error);
        }
    };
    // get user details
    const [user, setUser] = useState<{
        username: string;
        id: string;
    }>({
        username: "",
        id: "",
    });
    const getUserDetails = async () => {
        try {
            const res = await axios.get("/api/user");
            setUser(res.data);
        } catch (error) {
            console.log("Error getting user details", error);
        }
    };
    useEffect(() => {
        getWhiteboard();
        handleResize();
        getUserDetails();
    }, [params.id]);
    const [socket, setSocket] = useState<Socket | null>();
    const [socketConnectionCreated, setsocketConnectionCreated] =
        useState<boolean>(false);
    // create socket conneciton
    const createSocketConnection = async () => {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
            query: {
                data: JSON.stringify({ user, whiteboardID: params.id }),
            },
        });
        setSocket(socket);
        setsocketConnectionCreated(true);
    };
    useEffect(() => {
        if (user.id === "" || socketConnectionCreated || params.id === "")
            return;
        else createSocketConnection();
    }, [user, socketConnectionCreated]);
    //TODO use this data to show currently connected users
    const [cursorPosition, setCursorPosition] = useState<{
        x: number;
        y: number;
    }>({
        x: 0,
        y: 0,
    });
    useEffect(() => {
        if (!socket) return;
        socket.on("user-connected", (data) => {
            console.log("connected", data);
        });

        socket.on("user-disconnected", (data) => {
            console.log("disconnected", data);
        });
        socket.on("cursor-moving", (data: { x: number; y: number }) => {
            setCursorPosition(data);
        });
        socket.on("clear-canvas", () => {
            setClearCanvas(true);
            setTimeout(() => {
                setClearCanvas(false);
            }, 0);
        });
    }, [socket]);
    const handleResize = () => {
        if (parent.current) {
            const paddingX = getComputedStyle(parent.current).paddingInline;
            const paddingY = getComputedStyle(parent.current).paddingBlock;
            setSize({
                width: parent.current.clientWidth - parseInt(paddingX) * 2,
                height: parent.current.clientHeight - parseInt(paddingY) * 2,
            });
        }
    };
    let resizeObserver: ResizeObserver;
    useEffect(() => {
        if (parent.current) {
            resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(parent.current);
        }
        return () => {
            if (resizeObserver && parent.current) {
                resizeObserver.unobserve(parent.current);
            }
        };
    }, []);

    // defaultMode for canvas
    const [defaultMode, setDefaultMode] = useState<DrawAction>(
        DrawAction.Select
    );
    const icons: { [key: string]: ReactNode } = {
        [DrawAction.Select]: (
            <FaArrowPointer
                size={24}
                color={`${defaultMode === DrawAction.Select ? "#023E8A" : ""}`}
            />
        ),
        [DrawAction.Scribble]: (
            <FaPencilAlt
                size={24}
                color={`${
                    defaultMode === DrawAction.Scribble ? "#023E8A" : ""
                }`}
            />
        ),
        [DrawAction.Rectangle]: (
            <FaRegSquare
                size={24}
                color={`${
                    defaultMode === DrawAction.Rectangle ? "#023E8A" : ""
                }`}
            />
        ),
        [DrawAction.Circle]: (
            <FaRegCircle
                size={24}
                color={`${defaultMode === DrawAction.Circle ? "#023E8A" : ""}`}
            />
        ),
        [DrawAction.Eraser]: (
            <FaEraser
                size={24}
                color={`${defaultMode === DrawAction.Eraser ? "#023E8A" : ""}`}
            />
        ),
    };

    // color
    const [color, setColor] = useState<string>("#000000");
    // color swatch
    const [colorSwatch, setColorSwatch] = useState<string[]>([]);
    // color picker visibility
    const [colorPickerVisible, setColorPickerVisible] =
        useState<boolean>(false);
    // brush size
    const [brushSize, setBrushSize] = useState<number>(5);
    // clear button
    const [clearCanvas, setClearCanvas] = useState<boolean>(false);
    // whiteboard title
    const whiteboardTitleRef = useRef<HTMLInputElement>(null);
    const [editingTitle, setEditingTitle] = useState<boolean>(false);
    const [whiteboardTitle, setWhiteboardTitle] = useState<string>("Untitled");
    const updateWhiteboard = async () => {
        try {
            await axios.put("/api/whiteboard/update", {
                id: params.id,
                title: whiteboardTitle,
            });
        } catch (error) {
            console.log("Error in updating whiteboard", error);
        }
    };
    // saving whiteboard
    const [saveCanvas, setSaveCanvas] = useState<boolean>(false);
    const handleCursorMoving = (e: React.MouseEvent) => {
        console.log("mouse moving");
        let x = e.clientX;
        let y = e.clientY;
        if (parent.current) {
            const rect = parent.current.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        console.log(x, y);
        socket?.emit("cursor-moving", { x, y });
    };
    return (
        <main
            ref={parent}
            className="h-full w-full relative"
            onMouseMove={(e) => handleCursorMoving(e)}
        >
            <Toaster />
            <div
                className="absolute flex items-start gap-0.5"
                style={{ left: cursorPosition.x, top: cursorPosition.y }}
            >
                <FaMousePointer size={20} />
                <span className="bg-black text-white p-4 flex items-center justify-center rounded-full uppercase h-5 aspect-square">
                    M
                </span>
            </div>
            {size.width > 1 && size.height > 1 && (
                <Canvas
                    props={{
                        width: size.width,
                        height: size.height,
                        defaultMode,
                        color,
                        brushSize,
                    }}
                    clearCanvas={clearCanvas}
                    saveCanvas={saveCanvas}
                    colorSwatch={colorSwatch}
                    id={params.id}
                    socket={socket}
                />
            )}
            {/* whiteboard title */}
            <div className="top-2 bg-white rounded-md p-1.5 flex gap-2 items-center absolute left-1/2 -translate-x-1/2 ">
                <input
                    type="text"
                    value={whiteboardTitle}
                    onChange={(e) => setWhiteboardTitle(e.target.value)}
                    name="whiteboardTitle"
                    ref={whiteboardTitleRef}
                    size={
                        whiteboardTitle.length > 5
                            ? whiteboardTitle.length - 5
                            : 1
                    }
                    className=" focus:outline-none"
                    onMouseDown={(e) => e.preventDefault()}
                    onDoubleClick={() => {
                        if (whiteboardTitleRef.current) {
                            whiteboardTitleRef.current.focus();
                            const len = whiteboardTitle.length;
                            whiteboardTitleRef.current.setSelectionRange(
                                len,
                                len
                            );
                        }
                        setEditingTitle(true);
                    }}
                />
                {editingTitle || (
                    <FaEdit
                        size={20}
                        className="cursor-pointer"
                        onClick={() => {
                            if (whiteboardTitleRef.current) {
                                whiteboardTitleRef.current.focus();
                            }
                            setEditingTitle(true);
                        }}
                    />
                )}
                {editingTitle && (
                    <FaCheck
                        size={20}
                        className="cursor-pointer"
                        onClick={() => {
                            if (whiteboardTitleRef.current) {
                                whiteboardTitleRef.current.blur();
                            }
                            setEditingTitle(false);
                            updateWhiteboard();
                        }}
                    />
                )}
            </div>
            {/* Mode Selection */}
            <div className="top-1/2 -translate-y-1/2 absolute bg-white m-2 p-1.5  rounded-md flex flex-col gap-3.5 justify-center">
                {Object.keys(DrawAction)
                    .filter((key) => isNaN(Number(key)))
                    .map((action, index) => {
                        return (
                            <div className="relative flex items-center">
                                <button
                                    className={
                                        "p-1.5 peer" +
                                        `${
                                            defaultMode ===
                                            DrawAction[
                                                action as keyof typeof DrawAction
                                            ]
                                                ? " bg-[#CAF0F8] rounded"
                                                : ""
                                        }`
                                    }
                                    onClick={() =>
                                        setDefaultMode(
                                            DrawAction[
                                                action as keyof typeof DrawAction
                                            ]
                                        )
                                    }
                                    key={index}
                                >
                                    {
                                        icons[
                                            DrawAction[
                                                action as keyof typeof DrawAction
                                            ]
                                        ]
                                    }
                                </button>
                                <p className="absolute bg-black text-white hidden peer-hover:block left-[125%]  text-base p-1.5 rounded-md">
                                    {action}
                                </p>
                            </div>
                        );
                    })}
            </div>
            {/* Brush Options */}
            <div
                className="overflow-hidden absolute left-1/2 -translate-x-1/2 bottom-0 bg-white m-2 p-1.5  rounded-md flex gap-3.5 items-center"
                ref={brushBar}
            >
                {/* brush size */}
                <label htmlFor="brushSize">{brushSize}</label>
                <input
                    type="range"
                    id="brushSize"
                    name="brushSize"
                    min={1}
                    max={30}
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                />
                {/* color swatch */}
                <div className="flex gap-2 items-center">
                    {colorSwatch?.map((hex, index) => {
                        return (
                            <div
                                key={index}
                                style={{ backgroundColor: hex }}
                                className="w-7 flex items-center justify-center aspect-square rounded-full hover:cursor-pointer hover:shadow-lg"
                                onClick={() => setColor(hex)}
                            >
                                <div
                                    style={{
                                        visibility:
                                            color === hex
                                                ? "visible"
                                                : "hidden",
                                    }}
                                    className="w-3 aspect-square bg-white rounded-full"
                                ></div>
                            </div>
                        );
                    })}
                </div>
                {/* color picker preview */}
                <div className="flex items-center">
                    <div
                        className="w-7 aspect-square rounded-s-md hover:shadow-lg cursor-pointer "
                        style={{ backgroundColor: color }}
                        onClick={() =>
                            setColorPickerVisible(!colorPickerVisible)
                        }
                    ></div>
                    <label
                        htmlFor="hexCode"
                        className="w-7 aspect-square bg-gray-200 flex items-center justify-center"
                    >
                        #
                    </label>
                    <input
                        type="text"
                        name="hexCode"
                        id="hexCode"
                        maxLength={6}
                        value={color.slice(1)}
                        className="focus:outline-none px-1 w-20 rounded-e-md border-r-2 border-y-2 border-gray-200 mr-1"
                    />
                    {colorSwatch.includes(color) ? (
                        // already bookmarked
                        <FaBookmark
                            size={24}
                            className="cursor-pointer"
                            onClick={() => {
                                if (colorSwatch.length > 1)
                                    setColorSwatch(
                                        colorSwatch.filter(
                                            (hex) => hex !== color
                                        )
                                    );
                                else
                                    toast.error("Mimimum 1 color required", {
                                        duration: 2000,
                                        position: "bottom-center",
                                    });
                            }}
                        />
                    ) : (
                        // create bookmark
                        <FaRegBookmark
                            size={24}
                            className="cursor-pointer"
                            onClick={() => {
                                if (colorSwatch.length < 6)
                                    setColorSwatch([...colorSwatch, color]);
                                else
                                    toast.error("Maximum 6 colors allowed", {
                                        duration: 2000,
                                        position: "bottom-center",
                                    });
                            }}
                        />
                    )}
                </div>
            </div>
            {/* clear canvas and save canvas option */}
            <div className=" flex gap-4 absolute right-2 bg-white bottom-2  p-1.5 rounded-md">
                <div
                    className="flex gap-1 cursor-pointer"
                    onClick={() => {
                        setClearCanvas(!clearCanvas);
                        setTimeout(() => {
                            setClearCanvas(false);
                        }, 0);
                        socket?.emit("clear-canvas");
                    }}
                >
                    <FaTrashAlt size={24} />
                    <p>Clear</p>
                </div>
                <div
                    className="flex gap-1 cursor-pointer"
                    onClick={() => {
                        setSaveCanvas(!saveCanvas);
                        setTimeout(() => {
                            setSaveCanvas(false);
                        }, 0);
                    }}
                >
                    <FaSave size={24} />
                    <p>Save</p>
                </div>
            </div>
            {/* color picker */}
            {colorPickerVisible && (
                <div
                    style={{
                        bottom: brushBar.current
                            ? `${
                                  brushBar.current.getBoundingClientRect()
                                      .height +
                                  parseInt(
                                      window.getComputedStyle(brushBar.current)
                                          .paddingBlock
                                  ) +
                                  parseInt(
                                      window.getComputedStyle(brushBar.current)
                                          .marginBlock
                                  ) +
                                  2
                              }px`
                            : "0px",
                    }}
                    className="absolute left-1/2 -translate-x-1/2 bottom-2"
                >
                    <HexColorPicker color={color} onChange={setColor} />
                </div>
            )}
        </main>
    );
}
