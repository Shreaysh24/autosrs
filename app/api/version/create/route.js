import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Version } from "@/Models/Version";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { projectId, versionName, summary } = await request.json();

    if (!projectId || !versionName) {
      return NextResponse.json({ error: "Project ID and version name are required" }, { status: 400 });
    }

    const version = await Version.create({
      projectId,
      versionName,
      summary: summary || "",
      createdBy: session.user.id
    });

    return NextResponse.json({ version }, { status: 201 });
  } catch (error) {
    console.error("Error creating version:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}