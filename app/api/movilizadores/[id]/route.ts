import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = parseInt(id);
    if (isNaN(numId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const body = await req.json();
    const nombre = (body.variable ?? body.nombre)?.trim();
    if (!nombre) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }
    const updated = await prisma.movilizador.update({
      where: { id: numId },
      data: {
        nombre,
        variable: body.variable || null,
        notas:    body.notas    || null,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error al actualizar el movilizador" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = parseInt(id);
    if (isNaN(numId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    await prisma.movilizador.delete({ where: { id: numId } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Error al eliminar el movilizador" }, { status: 500 });
  }
}
