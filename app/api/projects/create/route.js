import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Project } from "@/Models/Projects";
import { User } from "@/Models/User";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { projectName } = await request.json();

    if (!projectName) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    // Create project
    const project = await Project.create({
      projectName,
      ownerId: session.user.id,
      collaborators: [{
        userId: session.user.id,
        role: "owner"
      }]
    });

    // Add to user's enrolled projects
    await User.findByIdAndUpdate(session.user.id, {
      $push: {
        enrolledProjects: {
          projectId: project._id,
          projectName: project.projectName
        }
      }
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}