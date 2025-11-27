import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/Models/User";
import { Project } from "@/Models/Projects";

export async function GET() {
  try {
    await dbConnect();
    
    const user = await User.findOne({ email: 'shreayshrc@gmail.com' });
    const projects = await Project.find({ ownerId: user?._id });
    
    // Just return projects directly
    const result = projects.map(project => ({
      _id: project._id,
      projectId: project,
      projectName: project.projectName,
      enrolledAt: new Date()
    }));
    
    return NextResponse.json({ 
      projects: result,
      debug: {
        userFound: !!user,
        projectsFound: projects.length
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}