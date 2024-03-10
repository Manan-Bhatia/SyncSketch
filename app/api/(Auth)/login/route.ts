import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";
import { UserObj } from "@/types/userForm";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// connect to db
connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody: UserObj = await request.json();
        const { email, password } = reqBody;

        //TODO: perform validation on email, username, password
        // check if user exists
        const user = await User.findOne({ email });
        // if does not exists, return error
        if (!user) {
            return NextResponse.json(
                { message: "User does not exist" },
                { status: 400 }
            );
        }
        // user exists, check password is correct or not
        const isPasswordCorrect = await bcryptjs.compare(
            password,
            user.password
        );
        // if password is not correct, return error
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { message: "Invalid password" },
                { status: 400 }
            );
        }
        // if password is correct, generate token
        // token data
        const tokenData = {
            id: user._id,
        };
        // generating token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
            expiresIn: "1d",
        });
        // building the response object
        const response = NextResponse.json(
            {
                message: "Login successful",
            },
            { status: 200 }
        );
        // settign the token in the cookie
        response.cookies.set("token", token, { httpOnly: true });
        // return the response
        return response;
    } catch (error) {
        return NextResponse.json(
            { message: "Error in login", error },
            { status: 500 }
        );
    }
}
