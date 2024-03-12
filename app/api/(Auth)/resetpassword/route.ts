import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { sendResetPasswordMail } from "@/helpers/sendResetPasswordMail";

// Reset password mail request
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email } = reqBody;

        // find a user with the email provided
        const user = await User.findOne({ email });

        // if user doesn't exist, return 404
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // if user exists, generate a token
        const forgotPasswordToken = await bcryptjs.hash(email, 10);
        const forgotPasswordTokenExpiry = new Date(Date.now() + 900000); // 15 minutes

        // update user details in the db
        await User.findOneAndUpdate(
            { email },
            {
                forgotPasswordToken,
                forgotPasswordTokenExpiry,
            }
        );

        // after updating the user details, send an email to the user
        const response: NextResponse = await sendResetPasswordMail(
            email,
            encodeURIComponent(forgotPasswordToken)
        );
        if (response.status === 500) {
            await User.findOneAndUpdate(
                { email },
                {
                    forgotPasswordToken: "",
                    forgotPasswordTokenExpiry: new Date(0),
                }
            );
        }
        return response;
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error in reset password", error },
            { status: 500 }
        );
    }
}

// Reset password
export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { password, confirmPassword, forgotPasswordToken } = reqBody;
        // check if the password and confirmPassword match
        if (password !== confirmPassword) {
            return NextResponse.json(
                { message: "Passwords do not match" },
                { status: 400 }
            );
        }
        // if password matches, find the user with the token
        const user = await User.findOne({ forgotPasswordToken });
        // if user doesn't exist, something went wrong
        if (!user) {
            throw new Error("User not found");
        }
        // if user exists, check if the token has expired
        if (user.forgotPasswordTokenExpiry < new Date(Date.now())) {
            return NextResponse.json(
                { message: "Token has expired" },
                { status: 400 }
            );
        }
        // if token hasn't expired, hash the password and update the user details
        const hashedPassword = await bcryptjs.hash(password, 10);
        await User.findOneAndUpdate(
            { forgotPasswordToken },
            {
                password: hashedPassword,
                forgotPasswordToken: "",
                forgotPasswordTokenExpiry: new Date(0),
            }
        );
        return NextResponse.json(
            { message: "Password reset successful" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error in reset password", error },
            { status: 500 }
        );
    }
}
