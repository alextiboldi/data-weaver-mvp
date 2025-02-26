
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { tableId, synonym, description } = body;

    const updatedTable = await prisma.tableInfo.update({
      where: { id: tableId },
      data: { 
        synonym,
        description,
      },
    });

    return NextResponse.json(updatedTable);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
