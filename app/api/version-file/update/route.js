import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { VersionFile } from "@/Models/VersionFile";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { versionId, codeSnippet, expectedOutput, testCase } = await request.json();

    if (!versionId) {
      return NextResponse.json({ error: "Version ID is required" }, { status: 400 });
    }

    const versionFile = await VersionFile.findOneAndUpdate(
      { versionId },
      {
        codeSnippet: codeSnippet || "",
        expectedOutput: expectedOutput || "",
        testCase: testCase || ""
      },
      { new: true }
    );

    if (!versionFile) {
      return NextResponse.json({ error: "Version file not found" }, { status: 404 });
    }

    return NextResponse.json({ versionFile });
  } catch (error) {
    console.error("Error updating version file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}