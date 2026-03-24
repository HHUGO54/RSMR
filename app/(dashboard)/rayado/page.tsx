import { prisma } from "@/lib/prisma";
import RayadoClient from "./RayadoClient";

export default async function RayadoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; seccion?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const seccion = params.seccion ? parseInt(params.seccion) : undefined;
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const pageSize = 50;

  const where = {
    ...(q && {
      OR: [
        { nombre: { contains: q } },
        { domicilio: { contains: q } },
        { telefono: { contains: q } },
        { notas: { contains: q } },
      ],
    }),
    ...(seccion && { seccion }),
  };

  const [registros, total] = await Promise.all([
    prisma.rayado.findMany({
      where,
      orderBy: { nombre: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.rayado.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <RayadoClient
      registros={registros}
      total={total}
      page={page}
      totalPages={totalPages}
      q={q}
      seccion={seccion?.toString() ?? ""}
    />
  );
}
