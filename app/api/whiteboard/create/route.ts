import { NextRequest, NextResponse } from "next/server";
import WhiteBoard from "@/models/whiteboardModel";
import getUserFromToken from "@/helpers/getUserFromToken";

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromToken(request);
        const newWhiteboard = await new WhiteBoard({
            users: [user._id],
            createdBy: user._id,
        });
        await newWhiteboard.save();
        return NextResponse.json(
            { message: "Whiteboard created", id: newWhiteboard._id },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error in creating whiteboard", error },
            { status: 500 }
        );
    }
}
