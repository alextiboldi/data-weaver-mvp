
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

    // Validate query - check for DELETE, INSERT, or UPDATE statements
    const normalizedQuery = query.trim().toLowerCase();
    if (
      normalizedQuery.startsWith("delete") ||
      normalizedQuery.startsWith("insert") ||
      normalizedQuery.startsWith("update")
    ) {
      return NextResponse.json(
        { message: "Action is not allowed" },
        { status: 403 }
      );
    }

    // Add LIMIT 10 to non-COUNT queries
    let finalQuery = query;
    if (!normalizedQuery.includes("count(") && !normalizedQuery.includes("limit ")) {
      // Simple heuristic - if query ends with a semicolon, insert before it
      if (finalQuery.trim().endsWith(";")) {
        finalQuery = finalQuery.trim().slice(0, -1) + " LIMIT 10;";
      } else {
        finalQuery = finalQuery.trim() + " LIMIT 10";
      }
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
    const res = await pool.query(finalQuery);

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Error running query:", error);
    return NextResponse.json(
      { message: `Failed to run query: ${error.message} ` },
      { status: 500 }
    );
  }
}
