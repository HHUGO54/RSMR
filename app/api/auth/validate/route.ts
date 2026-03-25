import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ valid: false });

  const sessionToken = (session.user as { sessionToken?: string }).sessionToken;
  if (!sessionToken) return NextResponse.json({ valid: false });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { sessionToken: true },
    });
    return NextResponse.json({ valid: user?.sessionToken === sessionToken });
  } catch {
    // DB error (e.g. column not yet migrated) → no invalidar sesión
    return NextResponse.json({ valid: true });
  }
}
