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
        ownerId: "cm7j5e16u0000cy28xs1hdemx",
      },
    });

    const dbSelectedProject = await prisma.project.findFirst({
      where: {
        ownerId: "cm7j5e16u0000cy28xs1hdemx",
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
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
