import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = parseInt(id);
    if (isNaN(numId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const body = await req.json();
    if (!body.nombre?.trim()) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }
    const updated = await prisma.rayado.update({
      where: { id: numId },
      data: {
        nombre:    body.nombre.trim(),
        fechaNac:  body.fechaNac  || null,
        seccion:   body.seccion  ? parseInt(body.seccion)  : null,
        domicilio: body.domicilio || null,
        correo:    body.correo    || null,
        telefono:  body.telefono  || null,
        fecha:     body.fecha     || null,
        monto:     body.monto     || null,
        notas:     body.notas     || null,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error al actualizar el registro" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = parseInt(id);
    if (isNaN(numId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    await prisma.rayado.delete({ where: { id: numId } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Error al eliminar el registro" }, { status: 500 });
  }
}
