import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { db } from "@/db";
import { projects, tasks } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const userId = await verifyToken(token);

    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
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
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        userId: projects.userId,
        createdAt: projects.createdAt,
        taskCount: sql<number>`count(${tasks.id})::int`,
      })
      .from(projects)
      .leftJoin(tasks, eq(tasks.projectId, projects.id))
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .groupBy(projects.id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: project,
      message: "Project fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    if (error instanceof Error && error.message === "Invalid token") {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch project", success: false },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const userId = await verifyToken(token);

    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
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

    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required", success: false },
        { status: 400 }
      );
    }

    const [updatedProject] = await db
      .update(projects)
      .set({ name, description })
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .returning();

    if (!updatedProject) {
      return NextResponse.json(
        { error: "Project not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: updatedProject,
      message: "Project updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    if (error instanceof Error && error.message === "Invalid token") {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update project", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const userId = await verifyToken(token);

    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
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

    const [deletedProject] = await db
      .delete(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .returning();

    if (!deletedProject) {
      return NextResponse.json(
        { error: "Project not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Project deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    if (error instanceof Error && error.message === "Invalid token") {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete project", success: false },
      { status: 500 }
    );
  }
}
