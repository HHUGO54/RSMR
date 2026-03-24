import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const body = await req.json();
    const tarea = await prisma.tarea.update({
      where: { id: numId },
      data: {
        ...(body.texto      !== undefined && { texto:      body.texto.trim() }),
        ...(body.nota       !== undefined && { nota:       body.nota?.trim() || null }),
        ...(body.completada !== undefined && { completada: Boolean(body.completada) }),
      },
    });
    return NextResponse.json(tarea);
  } catch {
    return NextResponse.json({ error: "Error al actualizar la tarea" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    await prisma.tarea.delete({ where: { id: numId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar la tarea" }, { status: 500 });
  }
}
