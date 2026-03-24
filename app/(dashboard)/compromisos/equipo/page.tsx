import { prisma } from "@/lib/prisma";
import EquipoClient from "./EquipoClient";

export default async function EquipoPage() {
  const equipo = await prisma.equipoCompromiso.findMany({ orderBy: { id: "asc" } });
  return <EquipoClient equipo={equipo} />;
}
