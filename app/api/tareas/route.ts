import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const texto = body.texto?.trim();
    if (!texto) {
      return NextResponse.json({ error: "El texto de la tarea es obligatorio" }, { status: 400 });
    }
    const equipoId = Number(body.equipoId);
    if (!Number.isInteger(equipoId) || equipoId <= 0) {
      return NextResponse.json({ error: "equipoId inválido" }, { status: 400 });
    }
    const tarea = await prisma.tarea.create({
      data: { equipoId, texto, nota: body.nota?.trim() || null },
    });
    return NextResponse.json(tarea);
  } catch {
    return NextResponse.json({ error: "Error al crear la tarea" }, { status: 500 });
  }
}
