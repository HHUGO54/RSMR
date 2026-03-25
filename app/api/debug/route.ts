import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

export async function GET() {
  const url = process.env.DATABASE_URL;
  const hasToken = !!process.env.DATABASE_AUTH_TOKEN;

  if (!url) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL no definida", url, hasToken });
  }

  try {
    const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
    const result = await client.execute("SELECT email FROM User LIMIT 1");
    client.close();
    return NextResponse.json({ ok: true, rows: result.rows, url, hasToken });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e), url, hasToken });
  }
}
