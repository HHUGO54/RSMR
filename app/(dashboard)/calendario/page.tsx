import { prisma } from "@/lib/prisma";
import CalendarioClient from "./CalendarioClient";

export default async function CalendarioPage() {
  const eventos = await prisma.evento.findMany({ orderBy: { fecha: "asc" } });
  return <CalendarioClient eventosInit={eventos} />;
}
