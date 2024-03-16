"use client";
import {
    Circle,
    DrawAction,
    Rectangle,
    Scribble,
} from "@/helpers/canvasHelper";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useState, useRef } from "react";
import { Stage, Layer, Line, Rect, Circle as KonvaCircle } from "react-konva";
import { v4 as uuidv4 } from "uuid";

export default function Canvas({
    props,
}: {
    props: {
        width: number;
        height: number;
    };
}) {
    const stageRef = useRef<Konva.Stage>(null);
    const currentShapeRef = useRef<String>();
    const [drawAction, setDrawAction] = useState<DrawAction>(DrawAction.Circle);
    const [color, setColor] = useState<string>("#000");
    // shapes
    const [scribbles, setScribbles] = useState<Scribble[]>([]);
    const [rectangles, setRectangles] = useState<Rectangle[]>([]);
    const [circles, setCircles] = useState<Circle[]>([]);

    const startDrawing = () => {
        if (drawAction === DrawAction.Select) return;
        if (stageRef.current === null) return;
        const stage = stageRef.current;
        const position = stage.getPointerPosition();
        const x = position?.x || 0;
        const y = position?.y || 0;
        const id = uuidv4();
        currentShapeRef.current = id;
        switch (drawAction) {
            case DrawAction.Scribble: {
                setScribbles((prev) => [
                    ...prev,
                    {
                        id,
                        color,
                        points: [x, y],
                    },
                ]);
                break;
            }
            case DrawAction.Rectangle: {
                setRectangles((prev) => [
                    ...prev,
                    {
                        id,
                        color,
                        width: 1,
                        height: 1,
                        x,
                        y,
                    },
                ]);
                break;
            }
            case DrawAction.Circle: {
                setCircles((prev) => [
                    ...prev,
                    {
                        id,
                        color,
                        radius: 1,
                        x,
                        y,
                    },
                ]);
                break;
            }
        }
    };

    const drawing = (event: KonvaEventObject<MouseEvent>) => {
        if (drawAction === DrawAction.Select) return;
        if (stageRef.current === null) return;
        const stage = stageRef.current;
        const id = currentShapeRef.current;
        const position = stage.getPointerPosition();
        const x = position?.x || 0;
        const y = position?.y || 0;
        switch (drawAction) {
            case DrawAction.Scribble: {
                setScribbles((prev) => {
                    const updatedScribbles = prev.map((scribble) => {
                        if (scribble.id === id) {
                            scribble.points = scribble.points.concat([x, y]);
                        }
                        return scribble;
                    });
                    return updatedScribbles;
                });
                break;
            }
            case DrawAction.Rectangle: {
                setRectangles((prev) => {
                    const updatedRectangles = prev.map((rectangle) => {
                        if (rectangle.id === id) {
                            rectangle.width = x - rectangle.x;
                            rectangle.height = y - rectangle.y;
                        }
                        return rectangle;
                    });
                    return updatedRectangles;
                });
                break;
            }
            case DrawAction.Circle: {
                setCircles((prev) => {
                    const updatedCircles = prev.map((circle) => {
                        if (circle.id == id) {
                            circle.radius = Math.sqrt(
                                Math.pow(x - circle.x, 2) +
                                    Math.pow(y - circle.y, 2)
                            );
                        }
                        return circle;
                    });
                    return updatedCircles;
                });
                break;
            }
        }
    };

    const stopDrawing = () => {
        currentShapeRef.current = undefined;
    };

    return (
        <Stage
            ref={stageRef}
            className="border-2 border-black overflow-hidden"
            width={props.width}
            height={props.height}
            onMouseDown={startDrawing}
            onMouseMove={drawing}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
        >
            <Layer>
                {scribbles.map((scribble, i) => (
                    <Line
                        key={i}
                        points={scribble.points}
                        stroke={scribble.color}
                        strokeWidth={5}
                    />
                ))}
                {rectangles.map((rectangle) => (
                    <Rect
                        key={rectangle.id}
                        x={rectangle?.x}
                        y={rectangle?.y}
                        height={rectangle?.height}
                        width={rectangle?.width}
                        stroke={rectangle?.color}
                        id={rectangle?.id}
                        strokeWidth={4}
                    />
                ))}
                {circles.map((circle) => (
                    <KonvaCircle
                        key={circle.id}
                        x={circle.x}
                        y={circle.y}
                        radius={circle.radius}
                        stroke={circle.color}
                        // strokeWidth={4}
                    />
                ))}
            </Layer>
        </Stage>
    );
}
