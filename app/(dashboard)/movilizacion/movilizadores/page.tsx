import { prisma } from "@/lib/prisma";
import MovilizadoresClient from "./MovilizadoresClient";

export default async function MovilizadoresPage() {
  const movilizadores = await prisma.movilizador.findMany({
    select: { id: true, nombre: true, variable: true, notas: true },
    orderBy: { nombre: "asc" },
  });
  return <MovilizadoresClient movilizadores={movilizadores} />;
}
