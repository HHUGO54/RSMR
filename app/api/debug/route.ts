import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

export async function GET() {
  try {
    const client = createClient({
      url: process.env.DATABASE_URL!,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    const result = await client.execute("SELECT email FROM User LIMIT 1");
    client.close();
    return NextResponse.json({ ok: true, rows: result.rows });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}
