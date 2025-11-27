import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/Models/User";

export async function GET() {
  try {
    await dbConnect();
    
    const user = await User.findOne({ email: 'shreayshrc@gmail.com' });
    
    return NextResponse.json({
      userExists: !!user,
      userId: user?._id,
      email: user?.email,
      projectCount: user?.enrolledProjects?.length || 0,
      projects: user?.enrolledProjects || []
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}