import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    console.log("Received registration request for:", email); // Add logging

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    console.log("Checking for existing user..."); // Add logging
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    console.log("Hashing password..."); // Add logging
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    console.log("Creating new user..."); // Add logging
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    console.log("User created:", newUser); // Add logging

    // Generate JWT token
    console.log("Generating token..."); // Add logging
    const token = jwt.sign(
      { userId: newUser[0].id },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "1d" }
    );

    return NextResponse.json(
      {
        user: { id: newUser[0].id, name, email },
        token,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    // More detailed error logging
    console.error("Registration error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
