import { prisma } from "@/lib/prisma";
import VariableDetalleClient from "./VariableDetalleClient";

export default async function VariableDetallePage({
  params,
}: {
  params: Promise<{ variable: string }>;
}) {
  const { variable } = await params;
  const nombre = decodeURIComponent(variable);

  const [activosRaw, aspirantes] = await Promise.all([
    prisma.activo.findMany({ orderBy: { nombre: "asc" } }),
    prisma.aspirante.findMany({ orderBy: { variable: "asc" } }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activos = activosRaw.filter((a) => (a as any).variableAsignada === nombre).map((a) => ({
    id: a.id,
    nombre: a.nombre,
    telefono: a.telefono,
    seccion: a.seccion,
    domicilio: a.domicilio,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variableAsignada: (a as any).variableAsignada as string | null,
  }));

  const variables: string[] = Array.from(
    new Set(aspirantes.map((a) => a.variable).filter(Boolean) as string[])
  );

  return (
    <VariableDetalleClient
      variable={nombre}
      activos={activos}
      variables={variables}
    />
  );
}
