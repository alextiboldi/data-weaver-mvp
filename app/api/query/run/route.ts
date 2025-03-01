import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Pool } from "pg";
export async function POST(req: NextRequest) {
  try {
    const { projectId, query } = await req.json();

    if (!projectId || !query) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tables: {
          include: {
            columns: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Connect to the database
    const pool = new Pool(project.connectionConfig);

    const schema = "onesource";
    const res = await pool.query(query);

    console.log("Result", res.columns);

    // This is a simplified implementation
    // In a real app, you would use the connection config to connect to the DB
    // and execute the query safely

    // For demo purposes, we'll return mock data
    // Replace this with actual query execution in production
    const mockResults = [
      { id: 1, name: "Sample Result 1", value: 100 },
      { id: 2, name: "Sample Result 2", value: 200 },
      { id: 3, name: "Sample Result 3", value: 300 },
    ];

    // // Simulate a delay for the query execution
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(mockResults);
  } catch (error) {
    console.error("Error running query:", error);
    return NextResponse.json(
      { message: "Failed to run query" },
      { status: 500 }
    );
  }
}
