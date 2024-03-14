"use client";
import dynamic from "next/dynamic";
const Canvas = dynamic(() => import("@/components/canvas"), { ssr: false });
export default function Paint() {
    return (
        <main className="h-full w-full p-6">
            <Canvas />
        </main>
    );
}
