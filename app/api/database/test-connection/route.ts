import { NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(request: Request) {
  try {
    const connection = await request.json();
    const client = new Client({
      host: connection.host,
      port: parseInt(connection.port),
      user: connection.username,
      password: connection.password,
      database: connection.database,
      schema: connection.schema,
    });

    try {
      await client.connect();
    } catch (error: any) {
      console.error("Failed to connect to database", error);
      return NextResponse.json({ error: error.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to test connection", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
