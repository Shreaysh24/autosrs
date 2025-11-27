import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('file');

    if (!filePath) {
      return NextResponse.json({ error: "File path is required" }, { status: 400 });
    }

    // Security check - ensure file is in assets/documents directory
    if (!filePath.startsWith('/assets/documents/')) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 403 });
    }

    const fullPath = path.join(process.cwd(), filePath.substring(1)); // Remove leading slash
    const fileBuffer = await readFile(fullPath);
    const fileName = path.basename(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}