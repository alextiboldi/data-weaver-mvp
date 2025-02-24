
import { NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(request: Request) {
  try {
    const connection = await request.json();
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
      await client.end();
      return NextResponse.json({ success: true });
    } catch (error: any) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || "Failed to connect to database" 
        }, 
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Invalid request data" 
      }, 
      { status: 400 }
    );
  }
}
