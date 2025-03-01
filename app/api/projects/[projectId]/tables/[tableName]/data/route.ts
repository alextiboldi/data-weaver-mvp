import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Client } from "pg";
export async function GET(
  request: Request,
  { params }: { params: { projectId: string; tableName: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
    });

    if (!project || !project.connectionConfig) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log(project.connectionConfig);

    const client = new Client({
      host: project.connectionConfig.host,
      port: parseInt(project.connectionConfig.port),
      user: project.connectionConfig.user,
      password: project.connectionConfig.password,
      database: project.connectionConfig.database,
      schema: project.connectionConfig.schema || "public",
    });

    const query = `SELECT * FROM ${project.connectionConfig.schema}.${params.tableName} LIMIT 10`;

    await client.connect();
    const res = await client.query(query);
    await client.end();

    return NextResponse.json({ data: res.rows });

    // Here you would use the connection config to connect to the actual database
    // For now, we'll return mock data
    // const mockData = Array.from({ length: 10 }).map((_, i) => ({
    //   id: i,
    //   name: `Record ${i}`,
    //   created_at: new Date().toISOString(),
    // }));

    // return NextResponse.json({ data: mockData });
  } catch (error) {
    console.error("Error fetching table data:", error);
    return NextResponse.json(
      { error: "Failed to fetch table data" },
      { status: 500 }
    );
  }
}
