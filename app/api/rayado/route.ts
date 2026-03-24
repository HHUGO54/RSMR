import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.nombre?.trim()) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }
    const rayado = await prisma.rayado.create({
      data: {
        nombre:   body.nombre.trim(),
        fechaNac: body.fechaNac || null,
        seccion:  body.seccion  ? parseInt(body.seccion)  : null,
        distrito: body.distrito ? parseInt(body.distrito) : 9,
        domicilio: body.domicilio || null,
        correo:    body.correo    || null,
        telefono:  body.telefono  || null,
        fecha:     body.fecha     || null,
        monto:     body.monto     || null,
        notas:     body.notas     || null,
      },
    });
    return NextResponse.json(rayado, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear el registro" }, { status: 500 });
  }
}
