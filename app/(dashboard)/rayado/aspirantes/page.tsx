import { prisma } from "@/lib/prisma";
import AspirantesClient from "./AspirantesClient";

export default async function AspirantesPage() {
  const aspirantes = await prisma.aspirante.findMany({
    select: { id: true, nombre: true, variable: true, notas: true },
    orderBy: { nombre: "asc" },
  });

  return <AspirantesClient aspirantes={aspirantes} />;
}
