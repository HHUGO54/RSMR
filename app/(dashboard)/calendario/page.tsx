import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CalendarioClient from "./CalendarioClient";

export default async function CalendarioPage() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const eventos = await prisma.evento.findMany({ orderBy: { fecha: "asc" } });
  return <CalendarioClient eventosInit={eventos} isAdmin={isAdmin} />;
}
