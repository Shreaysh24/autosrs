import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/Models/User";
import { Project } from "@/Models/Projects";
import { Version } from "@/Models/Version";
import { VersionFile } from "@/Models/VersionFile";

export async function GET() {
  try {
    await dbConnect();
    
    const user = await User.findOne({ email: 'shreayshrc@gmail.com' });
    const projects = await Project.find({ ownerId: user?._id });
    const versions = await Version.find({ createdBy: user?._id });
    const versionFiles = await VersionFile.find({});
    
    return NextResponse.json({
      user: {
        email: user?.email,
        enrolledProjectsCount: user?.enrolledProjects?.length || 0,
        enrolledProjects: user?.enrolledProjects || []
      },
      projects: projects.map(p => ({
        _id: p._id,
        projectName: p.projectName,
        ownerId: p.ownerId
      })),
      versions: versions.map(v => ({
        _id: v._id,
        projectId: v.projectId,
        versionName: v.versionName,
        summary: v.summary
      })),
      versionFiles: versionFiles.map(vf => ({
        _id: vf._id,
        projectId: vf.projectId,
        versionId: vf.versionId,
        mainFile: vf.mainFile
      })),
      counts: {
        projects: projects.length,
        versions: versions.length,
        versionFiles: versionFiles.length
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}