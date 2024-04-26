import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";
import { UserObj } from "@/types/userForm";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { z, ZodError } from "zod";

// connect to db
connect();
const signUpSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    username: z
        .string()
        .min(3, "Username should be atleast 3 characters")
        .max(50, "Username should be less than 50 characters")
        .refine(
            (val) => {
                return /^[a-zA-Z0-9]+$/.test(val);
            },
            {
                message: "Username should only contain letters and numbers",
            }
        ),
    password: z
        .string()
        .min(1, "Password is required")
        .min(5, "Password must have more than 5 characters")
        .refine(
            (val) => {
                return (
                    /[a-z]/.test(val) &&
                    /[A-Z]/.test(val) &&
                    /\d/.test(val) &&
                    /[!@#$%^&*]/.test(val)
                );
            },
            {
                message:
                    "Password must have at least 1 uppercase, 1 lowercase, 1 number and atleast 1 special character",
            }
        ),
});
type SignUpSchemaType = z.infer<typeof signUpSchema>;
const isZodError = (error: unknown): error is ZodError => {
    return error instanceof ZodError;
};

export async function POST(request: NextRequest) {
    try {
        const reqBody: UserObj = await request.json();
        try {
            signUpSchema.parse(reqBody);
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
        const { email, username, password } = reqBody;

        // check if user already exists
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }
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
