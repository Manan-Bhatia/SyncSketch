import { Circle, Rectangle, Scribble } from "@/helpers/canvasHelper";

export type WhiteBoardFields = {
    title: string;
    drawingData: {
        shapes: {
            scribbles: Scribble[];
            rectangles: Rectangle[];
            circles: Circle[];
        };
        colors: string[];
    };
    users: string[];
    createdBy: string;
};
