import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/Models/User";


export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password} = body;
        if (!password || !email ) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        
        await dbConnect();
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
     
            const newUser = new User({
                email,
                password
            });
            await newUser.save();
       
        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json(
        { message: "GET not supported on this route. Use POST." },
        { status: 405 }
    );
}
