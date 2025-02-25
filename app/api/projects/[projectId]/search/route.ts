import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("q");

  if (!searchTerm) {
    return NextResponse.json(
      { error: "Search term is required" },
      { status: 400 }
    );
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
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

    const results = await Promise.all(
      project.tables.map(async (table) => {
        // Filter string-type columns
        const stringColumns = table.columns.filter((col) =>
          ["character varying", "varchar", "text", "char", "string"].includes(
            col.type.toLowerCase()
          )
        );

        if (stringColumns.length === 0) return null;

        // Build WHERE clause
        const whereClause = stringColumns
          .map(
            (col) =>
              `${project.connectionConfig.schema}.${table.name}.${col.name}::text ILIKE $1`
          )
          .join(" OR ");

        const query = `
        SELECT COUNT(*) as match_count 
        FROM ${project.connectionConfig.schema}.${table.name}
        WHERE ${whereClause}
      `;

        console.log(query);

        try {
          const result = await pool.query(query, [`%${searchTerm}%`]);
          const matchCount = parseInt(result.rows[0].match_count);

          if (matchCount > 0) {
            return {
              tableName: table.name,
              matches: stringColumns.map((col) => ({
                column_name: col.name,
                match_count: matchCount,
              })),
            };
          }
        } catch (error) {
          console.error(`Error searching table ${table.name}:`, error);
        }

        return null;
      })
    );

    await pool.end();

    return NextResponse.json({
      results: results.filter(Boolean),
    });
  } catch (error) {
    console.error("Error during search:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
