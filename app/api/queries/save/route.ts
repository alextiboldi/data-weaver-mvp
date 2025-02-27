
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { projectId, name, description, query } = await req.json();

    if (!projectId || !name || !query) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Save the query
    const savedQuery = await prisma.query.create({
      data: {
        name,
        query,
        projectId,
      },
    });

    return NextResponse.json(savedQuery);
  } catch (error) {
    console.error("Error saving query:", error);
    return NextResponse.json(
      { message: "Failed to save query" },
      { status: 500 }
    );
  }
}
