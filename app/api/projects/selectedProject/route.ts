import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    console.log(JSON.stringify(dbSelectedProject, null, 2));

    return NextResponse.json(dbSelectedProject);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
