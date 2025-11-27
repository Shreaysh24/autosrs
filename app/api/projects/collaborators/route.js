import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Project } from "@/Models/Projects";
import { User } from "@/Models/User";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    await dbConnect();
    
    const project = await Project.findById(projectId)
      .populate('collaborators.userId', 'email')
      .populate('ownerId', 'email');

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ collaborators: project.collaborators, owner: project.ownerId });
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { projectId, email, role = "editor" } = await request.json();

    if (!projectId || !email) {
      return NextResponse.json({ error: "Project ID and email are required" }, { status: 400 });
    }

    // Check if user is project owner
    const project = await Project.findById(projectId);
    if (!project || project.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Only project owner can add collaborators" }, { status: 403 });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already a collaborator
    const isCollaborator = project.collaborators.some(c => c.userId.toString() === user._id.toString());
    if (isCollaborator) {
      return NextResponse.json({ error: "User is already a collaborator" }, { status: 400 });
    }

    // Add to project collaborators
    await Project.findByIdAndUpdate(projectId, {
      $push: {
        collaborators: {
          userId: user._id,
          role
        }
      }
    });

    // Add to user's enrolled projects
    await User.findByIdAndUpdate(user._id, {
      $push: {
        enrolledProjects: {
          projectId: project._id,
          projectName: project.projectName
        }
      }
    });

    return NextResponse.json({ message: "Collaborator added successfully" });
  } catch (error) {
    console.error("Error adding collaborator:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}