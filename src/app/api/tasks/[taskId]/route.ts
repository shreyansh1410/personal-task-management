import { NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/utils/auth";
import { NextRequest } from "next/server";

interface TaskUpdate {
  title?: string;
  description?: string;
  status?: string;
  completed?: boolean;
  completedAt?: Date;
  priority?: number;
  dueDate?: Date;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const userId = await verifyToken(token);
    const { taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const task = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, parseInt(taskId)))
      .then((res) => res[0]);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updateData = await req.json();
    const { title, description, status, completed, priority, dueDate } =
      updateData;

    const updateValues: TaskUpdate = {};

    if (title !== undefined) updateValues.title = title;
    if (description !== undefined) updateValues.description = description;
    if (status !== undefined) updateValues.status = status;
    if (completed !== undefined) {
      updateValues.completed = completed;
      if (completed) updateValues.completedAt = new Date();
    }
    if (priority !== undefined) updateValues.priority = priority;
    if (dueDate !== undefined) updateValues.dueDate = new Date(dueDate);

    if (Object.keys(updateValues).length === 0) {
      return NextResponse.json(
        { error: "No valid update fields provided" },
        { status: 400 }
      );
    }

    const updatedTask = await db
      .update(tasks)
      .set(updateValues)
      .where(eq(tasks.id, parseInt(taskId)))
      .returning();

    return NextResponse.json(updatedTask[0]);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const userId = await verifyToken(token);
    const { taskId } = await params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const task = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, parseInt(taskId)))
      .then((res) => res[0]);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await db.delete(tasks).where(eq(tasks.id, parseInt(taskId)));

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
