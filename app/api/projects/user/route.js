import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { User } from "@/Models/User";
import { Project } from "@/Models/Projects";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session user:', session?.user);
    
    if (!session) {
      console.log('No session found');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    console.log('User found:', !!user);
    console.log('User enrolled projects:', user?.enrolledProjects?.length);
    
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ projects: [] });
    }
    
    if (!user.enrolledProjects || user.enrolledProjects.length === 0) {
      console.log('No enrolled projects');
      return NextResponse.json({ projects: [] });
    }
    
    // Simple approach - just return the enrolled projects with project data
    const projectIds = user.enrolledProjects.map(ep => ep.projectId);
    console.log('Project IDs:', projectIds);
    
    const projects = await Project.find({ _id: { $in: projectIds } });
    console.log('Projects found:', projects.length);
    
    const result = user.enrolledProjects.map(ep => {
      const project = projects.find(p => p._id.toString() === ep.projectId.toString());
      return {
        _id: ep._id,
        projectId: project,
        projectName: ep.projectName,
        enrolledAt: ep.enrolledAt
      };
    }).filter(p => p.projectId); // Only include projects that exist
    
    console.log('Final result:', result.length, 'projects');
    return NextResponse.json({ projects: result });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.json({ projects: [] });
  }
}