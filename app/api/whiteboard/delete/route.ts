import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";
import WhiteBoard from "@/models/whiteboardModel";

// connect to DB
connect();

export async function DELETE(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { id } = reqBody;
        await WhiteBoard.findByIdAndDelete(id);
        return NextResponse.json(
            { message: "Whiteboard deleted" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error in deleting whiteboard" },
            { status: 500 }
        );
    }
}
