import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.equipoCompromiso.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Error al obtener equipo" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const variable = body.variable?.trim();
    if (!variable) {
      return NextResponse.json({ error: "La variable es obligatoria" }, { status: 400 });
    }
    const item = await prisma.equipoCompromiso.create({
      data: { variable, notas: body.notas?.trim() || null },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Error al crear el registro" }, { status: 500 });
  }
}
