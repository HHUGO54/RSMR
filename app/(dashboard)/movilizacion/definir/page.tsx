import { prisma } from "@/lib/prisma";
import MovilizacionDefinirClient from "./MovilizacionDefinirClient";

const FILTRO_VARIABLE = "SANDRA";

export default async function MovilizacionDefinirPage() {
  const [activosRaw, movilizadores] = await Promise.all([
    prisma.activo.findMany({ orderBy: { nombre: "asc" } }),
    prisma.movilizador.findMany({ orderBy: { variable: "asc" } }),
  ]);

  const activos = activosRaw
    .filter((a) => a.variableAsignada === FILTRO_VARIABLE)
    .map((a) => ({
      id: a.id,
      nombre: a.nombre,
      telefono: a.telefono,
      movilizacionAsignada: a.movilizacionAsignada,
    }));

  const variables: string[] = Array.from(
    new Set(movilizadores.map((m) => m.variable).filter(Boolean) as string[])
  );

  return (
    <MovilizacionDefinirClient
      activos={activos}
      variables={variables}
      filtroVariable={FILTRO_VARIABLE}
    />
  );
}
