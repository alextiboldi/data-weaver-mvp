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

    const schema = "onesource";

    //remove all tables from project that don't have the table.name book_contents
    // project.tables = project.tables.filter(
    //   (table) => table.name === "book_contents"
    // );

    const searchPromises = project.tables.map(async (table) => {
      // Filter string-type columns
      const stringColumns = table.columns.filter((col) =>
        ["character varying", "varchar", "text", "char", "string"].includes(
          col.type.toLowerCase()
        )
      );

      if (stringColumns.length === 0) return null;

      // Use map() to return an array of promises for each column search
      const columnPromises = stringColumns.map(async (column) => {
        const searchQuery = `
            SELECT '${table.name}' AS table_name, '${column.name}' AS column_name
            FROM ${schema}.${table.name}
            WHERE CAST(${schema}.${table.name}.${column.name} AS TEXT) = $1
            LIMIT 1;
          `;

        try {
          const res = await pool.query(searchQuery, [searchTerm]);

          if (res.rows.length > 0) {
            console.log(
              `Found in table: ${table.name}, column: ${column.name}`
            );
            return res.rows; // Returns the result properly
          }
        } catch (error) {
          console.error(
            `Error searching table ${table.name}, column ${column.name}:`,
            error
          );
        }

        return null; // Return null if no match
      });

      // Resolve all column search promises
      const columnResults = await Promise.all(columnPromises);
      return columnResults.filter(Boolean); // Filter out null results
    });

    // Resolve all table search promises
    const results = (await Promise.all(searchPromises)).flat(Infinity); // Flatten nested arrays

    await pool.end();
    console.log("Results: ", results);
    return NextResponse.json(results);
    // const results = [{ table_name: "book_contents", column_name: "page_name" }];
    // return NextResponse.json(results);
  } catch (error) {
    console.error("Error during search:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
