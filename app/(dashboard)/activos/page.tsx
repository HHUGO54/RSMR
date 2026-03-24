import { prisma } from "@/lib/prisma";
import ActivosClient from "./ActivosClient";

export default async function ActivosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; seccion?: string; indicador?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const seccion = params.seccion ? parseInt(params.seccion) : undefined;
  const indicador = params.indicador ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const pageSize = 50;

  const where = {
    ...(q && {
      OR: [
        { nombre: { contains: q } },
        { domicilio: { contains: q } },
        { correo: { contains: q } },
        { telefono: { contains: q } },
      ],
    }),
    ...(seccion && { seccion }),
    ...(indicador && { indicador }),
  };

  const [activos, total] = await Promise.all([
    prisma.activo.findMany({
      where,
      orderBy: { nombre: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.activo.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <ActivosClient
      activos={activos}
      total={total}
      page={page}
      totalPages={totalPages}
      q={q}
      seccion={seccion?.toString() ?? ""}
      indicador={indicador}
    />
  );
}
