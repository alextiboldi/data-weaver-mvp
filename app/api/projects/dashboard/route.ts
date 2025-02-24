
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dbProjectInfo = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        shortDescription: true,
      },
      where: {
        ownerId: "cm7dk3t5r0000cy6vou7nf4b3",
      },
    });

    const dbSelectedProject = await prisma.project.findFirst({
      where: {
        ownerId: "cm7dk3t5r0000cy6vou7nf4b3",
        isSelected: true,
      },
      include: {
        tables: {
          include: {
            columns: true,
            relationships: {
              include: {
                targetTable: true,
              },
            },
          },
        },
        queries: true,
      },
    });

    return NextResponse.json({ dbProjectInfo, dbSelectedProject });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
