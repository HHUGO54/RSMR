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
    const variable = body.variable?.trim();
    if (!variable) {
      return NextResponse.json({ error: "La variable es obligatoria" }, { status: 400 });
    }
    const item = await prisma.equipoCompromiso.update({
      where: { id: numId },
      data: { variable, notas: body.notas?.trim() || null },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Error al actualizar el registro" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    await prisma.equipoCompromiso.delete({ where: { id: numId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar el registro" }, { status: 500 });
  }
}
