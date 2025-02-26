
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { columnId, synonym, description } = body;

    const updatedColumn = await prisma.columnInfo.update({
      where: { id: columnId },
      data: {
        synonym,
        description,
      },
    });

    return NextResponse.json(updatedColumn);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
