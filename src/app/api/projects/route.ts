import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const userId = await verifyToken(token);

    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(projects.createdAt);

    return NextResponse.json({
      data: userProjects,
      message: "Projects fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    if (error instanceof Error && error.message === "Invalid token") {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch projects", success: false },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const userId = await verifyToken(token);

    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required", success: false },
        { status: 400 }
      );
    }

    const [newProject] = await db
      .insert(projects)
      .values({
        name,
        description,
        userId,
      })
      .returning();

    return NextResponse.json({
      data: newProject,
      message: "Project created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    if (error instanceof Error && error.message === "Invalid token") {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create project", success: false },
      { status: 500 }
    );
  }
}
