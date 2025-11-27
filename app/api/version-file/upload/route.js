import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { VersionFile } from "@/Models/VersionFile";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const formData = await request.formData();
    
    const projectId = formData.get('projectId');
    const versionId = formData.get('versionId');
    const codeSnippet = formData.get('codeSnippet') || "";
    const expectedOutput = formData.get('expectedOutput') || "";
    const testCase = formData.get('testCase') || "";
    const file = formData.get('mainFile');

    if (!projectId || !versionId) {
      return NextResponse.json({ error: "Project ID and Version ID are required" }, { status: 400 });
    }

    let mainFileUrl = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(process.cwd(), 'assets', 'documents', fileName);
      
      await writeFile(filePath, buffer);
      mainFileUrl = `/assets/documents/${fileName}`;
    }

    const versionFile = await VersionFile.create({
      projectId,
      versionId,
      mainFile: mainFileUrl,
      codeSnippet,
      expectedOutput,
      testCase
    });

    return NextResponse.json({ versionFile }, { status: 201 });
  } catch (error) {
    console.error("Error uploading version file:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}