import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const data = await req.json();
    const titulo = data.titulo?.trim();
    if (!titulo) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
    }
    if (!data.fecha) {
      return NextResponse.json({ error: "La fecha es obligatoria" }, { status: 400 });
    }
    const evento = await prisma.evento.update({
      where: { id: numId },
      data: {
        titulo,
        fecha:       data.fecha,
        hora:        data.hora?.trim()        || null,
        lugar:       data.lugar?.trim()       || null,
        descripcion: data.descripcion?.trim() || null,
        responsable: data.responsable?.trim() || null,
        contacto:    data.contacto?.trim()    || null,
        telefono:    data.telefono?.trim()    || null,
      },
    });
    return NextResponse.json(evento);
  } catch {
    return NextResponse.json({ error: "Error al actualizar el evento" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    await prisma.evento.delete({ where: { id: numId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar el evento" }, { status: 500 });
  }
}
