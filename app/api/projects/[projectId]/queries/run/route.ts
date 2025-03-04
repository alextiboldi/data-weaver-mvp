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

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Error running query:", error);
    return NextResponse.json(
      { message: `Failed to run query: ${error.message} ` },
      { status: 500 }
    );
  }
}
