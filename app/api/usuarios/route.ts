import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.email?.trim() || !body.password?.trim()) {
      return NextResponse.json({ error: "Email y contraseña son obligatorios" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email: body.email.trim() } });
    if (existing) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 });
    }
    const hash = await bcrypt.hash(body.password.trim(), 10);
    const user = await prisma.user.create({
      data: {
        email: body.email.trim(),
        password: hash,
        name: body.name?.trim() || null,
        role: body.role === "ADMIN" ? "ADMIN" : "USER",
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
  }
}
