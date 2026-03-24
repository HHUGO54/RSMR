import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows = await prisma.seccionRecorrida.findMany();
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Error al obtener secciones" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const seccion = Number(body.seccion);
    if (!Number.isInteger(seccion) || seccion <= 0) {
      return NextResponse.json({ error: "Sección inválida" }, { status: 400 });
    }
    if (typeof body.recorrida !== "boolean") {
      return NextResponse.json({ error: "El campo recorrida debe ser boolean" }, { status: 400 });
    }
    const row = await prisma.seccionRecorrida.upsert({
      where:  { seccion },
      update: { recorrida: body.recorrida },
      create: { seccion,  recorrida: body.recorrida },
    });
    return NextResponse.json(row);
  } catch {
    return NextResponse.json({ error: "Error al actualizar sección" }, { status: 500 });
  }
}
