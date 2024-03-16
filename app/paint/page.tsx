"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
const Canvas = dynamic(() => import("@/components/canvas"), { ssr: false });
export default function Paint() {
    const parent = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<{
        width: number;
        height: number;
    }>({
        width: 1,
        height: 1,
    });
    useEffect(() => {
        handleResize();
    }, []);
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

    return (
        <main ref={parent} className="h-full w-full p-6">
            {size.width > 1 && size.height > 1 && <Canvas props={size} />}
        </main>
    );
}
