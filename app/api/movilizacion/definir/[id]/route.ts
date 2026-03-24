import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = parseInt(id);
    if (isNaN(numId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const { movilizacionAsignada } = await req.json();
    const updated = await prisma.activo.update({
      where: { id: numId },
      data: { movilizacionAsignada: movilizacionAsignada ?? null },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error al asignar movilización" }, { status: 500 });
  }
}
