import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";
import getUserFromToken from "@/helpers/getUserFromToken";
import WhiteBoard from "@/models/whiteboardModel";

// connect to DB
connect();

export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromToken(request);
        if (user) {
            const whiteboards = await WhiteBoard.find({ createdBy: user._id });
            return NextResponse.json(whiteboards, { status: 200 });
        } else {
            return NextResponse.json(
                { message: "User not found" },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { message: "Error in getting all whiteboards" },
            { status: 500 }
        );
    }
}
