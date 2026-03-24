import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.nombre?.trim()) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }
    const aspirante = await prisma.aspirante.create({
      data: {
        nombre:    body.nombre.trim(),
        fechaNac:  body.fechaNac  || null,
        seccion:   body.seccion  ? parseInt(body.seccion)  : null,
        distrito:  body.distrito ? parseInt(body.distrito) : 9,
        domicilio: body.domicilio || null,
        correo:    body.correo    || null,
        telefono:  body.telefono  || null,
        variable:  body.variable  || null,
        notas:     body.notas     || null,
      },
    });
    return NextResponse.json(aspirante, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear el aspirante" }, { status: 500 });
  }
}
