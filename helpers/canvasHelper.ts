export enum DrawAction {
    Select,
    Scribble,
    Rectangle,
    Circle,
}

export type Shape = {
    id: string;
    color: string;
};

export type Scribble = Shape & {
    points: number[];
};

export type Rectangle = Shape & {
    // length
    width: number;
    // breadth
    height: number;
    x: number;
    y: number;
};

export type Circle = Shape & {
    radius: number;
    x: number;
    y: number;
};
