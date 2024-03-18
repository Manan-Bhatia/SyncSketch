import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";
import WhiteBoard from "@/models/whiteboardModel";

// connect to the database
connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { id } = reqBody;
        const whiteboard = await WhiteBoard.findById(id);
        return NextResponse.json(whiteboard, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Error in getting whiteboard" },
            { status: 500 }
        );
    }
}
