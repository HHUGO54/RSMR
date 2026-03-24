import { prisma } from "@/lib/prisma";
import MovGraficaClient from "./MovGraficaClient";

export default async function MovGraficaPage() {
  const activosRaw = await prisma.activo.findMany({ orderBy: { nombre: "asc" } });

  const conteo: Record<string, number> = {};
  let sinAsignar = 0;

  for (const a of activosRaw) {
    if (a.movilizacionAsignada) {
      conteo[a.movilizacionAsignada] = (conteo[a.movilizacionAsignada] ?? 0) + 1;
    } else {
      sinAsignar++;
    }
  }

  const datos = Object.entries(conteo)
    .map(([variable, total]) => ({ variable, total }))
    .sort((a, b) => b.total - a.total);

  return (
    <MovGraficaClient
      datos={datos}
      sinAsignar={sinAsignar}
      totalActivos={activosRaw.length}
      activos={activosRaw.map((a) => ({
        id: a.id,
        nombre: a.nombre,
        movilizacionAsignada: a.movilizacionAsignada,
      }))}
    />
  );
}
