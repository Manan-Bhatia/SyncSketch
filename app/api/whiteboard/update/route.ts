import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";
import WhiteBoard from "@/models/whiteboardModel";

// connect to the database
connect();

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { id, ...updateData } = reqBody;

        const updatedWhiteboard = await WhiteBoard.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { new: true }
        );

        return NextResponse.json(updatedWhiteboard);
    } catch (error) {
        return NextResponse.json(
            { message: "Error in updating whiteboard" },
            { status: 500 }
        );
    }
}
