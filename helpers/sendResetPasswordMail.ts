import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
export const sendResetPasswordMail = async (
    email: string,
    forgotPasswordToken: string
) => {
    // create a transporter
    // for testing, using gmail
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAILING_USERNAME,
            pass: process.env.MAILING_PASSWORD,
        },
    });

    // set up mail options
    const resetPasswordUrl = `${process.env.DOMAIN}/resetPassword/${forgotPasswordToken}`;
    const mailOptions = {
        from: process.env.MAILING_USERNAME,
        to: email,
        subject: "Reset Password for SyncSketch",
        html: `
        <h1>Reset Password</h1>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <a href="${resetPasswordUrl}" target="_blank">Reset Password</a>
        <p>If you did not request to reset your password, you can ignore this email.</p>
        `,
    };

    // send the mail
    try {
        await transport.sendMail(mailOptions);
        return NextResponse.json(
            { message: "Reset password mail sent" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error in sending reset password mail", error },
            { status: 500 }
        );
    }
};
