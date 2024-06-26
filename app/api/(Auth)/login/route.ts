import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";
import { UserObj } from "@/types/userForm";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignJWT } from "jose";
import { z, ZodError } from "zod";

// connect to db
connect();
const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(5, "Password must have more than 5 characters"),
});
type LoginSchemaType = z.infer<typeof loginSchema>;
const isZodError = (error: unknown): error is ZodError => {
    return error instanceof ZodError;
};

export async function POST(request: NextRequest) {
    try {
        const reqBody: UserObj = await request.json();
        try {
            loginSchema.parse(reqBody);
        } catch (validationError: unknown) {
            if (isZodError(validationError)) {
                return NextResponse.json(
                    {
                        message: "Validation error",
                        errors: validationError.errors,
                    },
                    { status: 400 }
                );
            } else {
                return NextResponse.json(
                    { message: "Validation error", error: validationError },
                    { status: 400 }
                );
            }
        }

        const { email, password } = reqBody;

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
        // const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
        //     expiresIn: "1d",
        // });
        const token = await new SignJWT(tokenData)
            .setProtectedHeader({
                alg: "HS256",
                typ: "JWT",
            })
            .setExpirationTime("1day")
            .setIssuedAt(Math.floor(Date.now() / 1000))
            .sign(new TextEncoder().encode(process.env.TOKEN_SECRET!));
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
