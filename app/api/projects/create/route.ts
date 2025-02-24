import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";
// import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import { Table } from "@/lib/types";
import { Client } from "pg";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.id) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    //fetch db meta data

    const client = new Client({
      host: data.connection.host,
      port: parseInt(data.connection.port),
      user: data.connection.user,
      password: data.connection.password,
      database: data.connection.database,
      schema: data.connection.schema,
    });

    await client.connect();
    console.log("Connected");

    // Get table list and column information
    const tableInfoQuery = `
    SELECT 
    c.table_name,
    c.column_name,
    c.data_type,
    CASE 
        WHEN c.data_type IN ('character varying', 'character', 'text') 
        THEN c.character_maximum_length::TEXT 
        ELSE NULL 
    END AS column_size,
    col_desc.description AS column_comment,
    tbl_desc.description AS table_comment,
    CASE 
        WHEN tc.constraint_type = 'PRIMARY KEY' THEN 'PRIMARY KEY'
        WHEN kcu2.table_name IS NOT NULL THEN 'FOREIGN KEY'
        ELSE 'NONE'
    END AS relationship_type,
    CASE 
        WHEN tc.constraint_type = 'PRIMARY KEY' THEN true
        ELSE false
    END AS is_primary_key,
    CASE 
        WHEN kcu2.table_name IS NOT NULL THEN true
        ELSE false
    END AS is_foreign_key,
    kcu2.table_name AS referenced_table,
    kcu2.column_name AS referenced_column
FROM information_schema.columns c
LEFT JOIN information_schema.key_column_usage kcu 
    ON c.table_name = kcu.table_name 
    AND c.column_name = kcu.column_name
LEFT JOIN information_schema.table_constraints tc 
    ON kcu.constraint_name = tc.constraint_name
LEFT JOIN information_schema.referential_constraints rc 
    ON tc.constraint_name = rc.constraint_name
LEFT JOIN information_schema.key_column_usage kcu2 
    ON rc.unique_constraint_name = kcu2.constraint_name
LEFT JOIN pg_catalog.pg_description col_desc 
    ON col_desc.objsubid = c.ordinal_position
    AND col_desc.objoid = (SELECT oid FROM pg_class WHERE relname = c.table_name)
LEFT JOIN pg_catalog.pg_description tbl_desc 
    ON tbl_desc.objsubid = 0
    AND tbl_desc.objoid = (SELECT oid FROM pg_class WHERE relname = c.table_name)
WHERE c.table_schema = $1
ORDER BY c.table_name, c.ordinal_position;
  `;
    const result = await client.query(tableInfoQuery, [
      data.connection.schema || "public",
    ]);
    console.log("Got result");
    // Group results by table
    const tables = result.rows.reduce((acc, row) => {
      let table = acc.find((t) => t.tableName === row.table_name);
      if (!table) {
        table = {
          tableName: row.table_name,
          comment: row.table_comment,
          columns: [],
          relationships: [],
        };
        acc.push(table);
      }

      table.columns.push({
        name: row.column_name,
        type: row.data_type,
        columnSize: row.column_size,
        comment: row.column_comment,
        isPrimaryKey: row.is_primary_key,
        isForeignKey: row.is_foreign_key,
      });

      // Add relationship if it's a foreign key
      if (row.is_foreign_key) {
        table.relationships.push({
          sourceColumn: row.column_name,
          targetTable: row.referenced_table,
          targetColumn: row.referenced_column,
        });
      }

      return acc;
    }, []);

    const project = await prisma.project.create({
      data: {
        ownerId: "cm7dk3t5r0000cy6vou7nf4b3", // You should get this from the session
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description,
        dataSource: data.dataSource,
        connectionConfig: data.connection,
        tables: {
          create: Object.values(tables).map((table: any) => ({
            tableName: table.tableName,
            comment: table.comment,
            columns: {
              create: table.columns.map((column: any) => ({
                name: column.name,
                type: column.type,
                columnSize: column.columnSize,
                comment: column.comment,
                isPrimaryKey: column.isPrimaryKey,
                isForeignKey: column.isForeignKey,
              })),
            },
          })),
        },
      },
      include: {
        tables: {
          include: {
            columns: true,
          },
        },
      },
    });

    // Create relationships after tables are created
    for (const tableInfo of tables) {
      const sourceTable = project.tables.find(
        (t) => t.tableName === tableInfo.tableName
      );
      // console.log("Source Table", sourceTable);
      for (const relationship of tableInfo.relationships || []) {
        const targetTable = project.tables.find(
          (t) => t.tableName === relationship.targetTable
        );

        if (sourceTable && targetTable) {
          await prisma.relationship.create({
            data: {
              sourceTableId: sourceTable.id,
              sourceColumn: relationship.sourceColumn,
              targetTableId: targetTable.id,
              targetColumn: relationship.targetColumn,
            },
          });
        }
      }
    }
    // console.log("Project", JSON.stringify(project, null, 2));

    return NextResponse.json(project);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
