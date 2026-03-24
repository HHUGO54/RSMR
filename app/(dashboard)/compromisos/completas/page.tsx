import { prisma } from "@/lib/prisma";
import CompletasClient from "./CompletasClient";

export default async function CompletasPage() {
  const equipo = await prisma.equipoCompromiso.findMany({
    orderBy: { id: "asc" },
    include: { tareas: { where: { completada: true }, orderBy: { id: "asc" } } },
  });
  // Solo incluir variables que tengan al menos una tarea completa
  const conTareas = equipo.filter((e) => e.tareas.length > 0);
  return <CompletasClient equipo={conTareas} />;
}
