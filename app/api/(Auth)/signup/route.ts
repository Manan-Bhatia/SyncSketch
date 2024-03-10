import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";
import { UserObj } from "@/types/userForm";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

// connect to db
connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody: UserObj = await request.json();
        const { email, username, password } = reqBody;

        // check if user already exists
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }
        //TODO: perform validation on email, username, password
        // user does not exist, create new user
        // hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        // create new user
        const newUser = await new User({
            email,
            username,
            password: hashedPassword,
        });
        await newUser.save();
        return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Error in signup", error },
            { status: 500 }
        );
    }
}
