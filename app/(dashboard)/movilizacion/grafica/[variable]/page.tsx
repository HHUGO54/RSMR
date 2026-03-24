import { prisma } from "@/lib/prisma";
import MovVariableDetalleClient from "./MovVariableDetalleClient";

export default async function MovVariableDetallePage({
  params,
}: {
  params: Promise<{ variable: string }>;
}) {
  const { variable } = await params;
  const nombre = decodeURIComponent(variable);

  const [activosRaw, movilizadores] = await Promise.all([
    prisma.activo.findMany({ orderBy: { nombre: "asc" } }),
    prisma.movilizador.findMany({ orderBy: { variable: "asc" } }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activos = activosRaw.filter((a) => (a as any).movilizacionAsignada === nombre).map((a) => ({
    id: a.id,
    nombre: a.nombre,
    telefono: a.telefono,
    seccion: a.seccion,
    domicilio: a.domicilio,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    movilizacionAsignada: (a as any).movilizacionAsignada as string | null,
  }));

  const variables: string[] = Array.from(
    new Set(movilizadores.map((m) => m.variable).filter(Boolean) as string[])
  );

  return <MovVariableDetalleClient variable={nombre} activos={activos} variables={variables} />;
}
