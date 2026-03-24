import { prisma } from "@/lib/prisma";
import DefinirClient from "./DefinirClient";

export default async function DefinirPage() {
  const [activos, aspirantes] = await Promise.all([
    prisma.activo.findMany({ orderBy: { nombre: "asc" } }),
    prisma.aspirante.findMany({ orderBy: { variable: "asc" } }),
  ]);

  const variables: string[] = Array.from(
    new Set(aspirantes.map((a) => a.variable).filter(Boolean) as string[])
  );

  return (
    <DefinirClient
      activos={activos.map((a) => ({
        id: a.id,
        nombre: a.nombre,
        telefono: a.telefono,
        variableAsignada: a.variableAsignada,
      }))}
      variables={variables}
    />
  );
}
