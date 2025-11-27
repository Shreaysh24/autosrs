import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { VersionFile } from "@/Models/VersionFile";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const versionId = searchParams.get('versionId');

    if (!versionId) {
      return NextResponse.json({ error: "Version ID is required" }, { status: 400 });
    }

    await dbConnect();
    
    const versionFile = await VersionFile.findOne({ versionId });

    if (!versionFile) {
      return NextResponse.json({ error: "Version file not found" }, { status: 404 });
    }

    return NextResponse.json({ versionFile });
  } catch (error) {
    console.error("Error fetching version file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}