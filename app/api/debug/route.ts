import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.DATABASE_URL;
  const hasToken = !!process.env.DATABASE_AUTH_TOKEN;

  // Test 1: @libsql/client directo
  let libsqlOk = false;
  let libsqlError = "";
  try {
    const { createClient } = await import("@libsql/client");
    const client = createClient({ url: url!, authToken: process.env.DATABASE_AUTH_TOKEN });
    await client.execute("SELECT 1");
    client.close();
    libsqlOk = true;
  } catch (e) {
    libsqlError = String(e);
  }

  // Test 2: Prisma con adapter
  let prismaOk = false;
  let prismaError = "";
  try {
    const { PrismaClient } = await import("@prisma/client");
    const { PrismaLibSql } = await import("@prisma/adapter-libsql");
    const adapter = new PrismaLibSql({ url: url!, authToken: process.env.DATABASE_AUTH_TOKEN });
    const prisma = new PrismaClient({ adapter });
    await prisma.user.findFirst();
    await prisma.$disconnect();
    prismaOk = true;
  } catch (e) {
    prismaError = String(e);
  }

  return NextResponse.json({ url, hasToken, libsqlOk, libsqlError, prismaOk, prismaError });
}
