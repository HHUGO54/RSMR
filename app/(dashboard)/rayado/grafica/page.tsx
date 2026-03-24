import { prisma } from "@/lib/prisma";
import GraficaClient from "./GraficaClient";

export default async function GraficaPage() {
  const activosRaw = await prisma.activo.findMany({ orderBy: { nombre: "asc" } });

  const conteo: Record<string, number> = {};
  let sinAsignar = 0;

  for (const a of activosRaw) {
    if (a.variableAsignada) {
      conteo[a.variableAsignada] = (conteo[a.variableAsignada] ?? 0) + 1;
    } else {
      sinAsignar++;
    }
  }

  const datos = Object.entries(conteo)
    .map(([variable, total]) => ({ variable, total }))
    .sort((a, b) => b.total - a.total);

  return (
    <GraficaClient
      datos={datos}
      sinAsignar={sinAsignar}
      totalActivos={activosRaw.length}
      activos={activosRaw.map((a) => ({
        id: a.id,
        nombre: a.nombre,
        variableAsignada: a.variableAsignada,
      }))}
    />
  );
}
