import { NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(request: Request) {
  try {
    const connection = await request.json();
    console.log("Connection", JSON.stringify(connection, null, 2));
    const client = new Client({
      host: connection.host,
      port: parseInt(connection.port),
      user: connection.user,
      password: connection.password,
      database: connection.database,
      schema: connection.schema || "public",
    });

    try {
      await client.connect();
      const res = await client.query("SELECT NOW()");

      await client.end();
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.log("Error connecting to database", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to connect to database",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request data",
      },
      { status: 400 }
    );
  }
}
