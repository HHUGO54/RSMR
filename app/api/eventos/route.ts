import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({ orderBy: { fecha: "asc" } });
    return NextResponse.json(eventos);
  } catch {
    return NextResponse.json({ error: "Error al obtener eventos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const titulo = data.titulo?.trim();
    if (!titulo) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
    }
    if (!data.fecha) {
      return NextResponse.json({ error: "La fecha es obligatoria" }, { status: 400 });
    }
    const evento = await prisma.evento.create({
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
    return NextResponse.json({ error: "Error al crear el evento" }, { status: 500 });
  }
}
