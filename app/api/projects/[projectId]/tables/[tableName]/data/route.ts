
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string; tableName: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
      include: { connectionConfig: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Here you would use the connection config to connect to the actual database
    // For now, we'll return mock data
    const mockData = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      name: `Record ${i}`,
      created_at: new Date().toISOString(),
    }));

    return NextResponse.json({ data: mockData });
  } catch (error) {
    console.error("Error fetching table data:", error);
    return NextResponse.json(
      { error: "Failed to fetch table data" },
      { status: 500 }
    );
  }
}
