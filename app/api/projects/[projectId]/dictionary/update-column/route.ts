import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { columns } = body;

    const columnIds = Object.keys(columns);
    const columnUpdates = await Promise.all(
      columnIds.map((columnId) => {
        const { synonym, description } = columns[columnId];
        return prisma.columnInfo.update({
          where: { id: columnId },
          data: {
            synonym,
            description,
          },
        });
      })
    );

    return NextResponse.json({ columns: columnUpdates });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
