import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { db } from "@/db";
import { projects, tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const userId = await verifyToken(token);

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Invalid project ID", success: false },
        { status: 400 }
      );
    }

    const projectId = parseInt(id);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID", success: false },
        { status: 400 }
      );
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));

    if (!project) {
      return NextResponse.json(
        { error: "Project not found", success: false },
        { status: 404 }
      );
    }

    const projectTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(tasks.createdAt);

    return NextResponse.json({
      data: projectTasks,
      message: "Tasks fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    if (error instanceof Error && error.message === "Invalid token") {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch tasks", success: false },
      { status: 500 }
    );
  }
}
