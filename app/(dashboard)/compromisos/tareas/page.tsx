import { prisma } from "@/lib/prisma";
import TareasClient from "./TareasClient";

export default async function TareasPage() {
  const equipo = await prisma.equipoCompromiso.findMany({
    orderBy: { id: "asc" },
    include: { tareas: { where: { completada: false }, orderBy: { id: "asc" } } },
  });
  return <TareasClient equipo={equipo} />;
}
