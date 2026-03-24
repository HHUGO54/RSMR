import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nombre = (body.nombre ?? body.variable)?.trim();
    if (!nombre) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }
    const movilizador = await prisma.movilizador.create({
      data: {
        nombre,
        variable: body.variable || null,
        notas:    body.notas    || null,
      },
    });
    return NextResponse.json(movilizador, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear el movilizador" }, { status: 500 });
  }
}
