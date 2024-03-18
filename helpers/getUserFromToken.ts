import { NextRequest } from "next/server";
import { decodeJwt } from "jose";
import User from "@/models/userModel";
import { connect } from "@/db/dbConfig";

// connect to DB
connect();

export default async function getUserFromToken(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value || "";
        const { id } = decodeJwt(token);
        const user = await User.findById(id);
        return user;
    } catch (error) {
        return null;
    }
}
