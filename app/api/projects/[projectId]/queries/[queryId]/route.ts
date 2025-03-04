import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Update a query
export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string; queryId: string } }
) {
  try {
    const { name, description, query } = await request.json();

    if (!name || !query) {
      return NextResponse.json(
        { error: "Name and query content are required" },
        { status: 400 }
      );
    }

    const updatedQuery = await prisma.query.update({
      where: {
        id: params.queryId,
      },
      data: {
        name,
        description,
        query,
      },
    });

    return NextResponse.json(updatedQuery);
  } catch (error) {
    console.error("Error updating query:", error);
    return NextResponse.json(
      { error: "Failed to update query" },
      { status: 500 }
    );
  }
}

// Delete a query
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { projectId: string; queryId: string } }
) {
  try {
    await prisma.query.delete({
      where: {
        id: params.queryId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting query:", error);
    return NextResponse.json(
      { error: "Failed to delete query" },
      { status: 500 }
    );
  }
}
